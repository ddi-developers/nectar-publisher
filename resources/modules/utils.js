import Papa from 'papaparse';
import { Dataset } from '../models/Dataset.ts'
import { DatasetColumn } from '../models/DatasetColumn.ts'
import { WebR } from 'webr'
import { readDDiCString } from './importers/ddi-c-xml-importer.js'
import { checksum } from '../helpers/checksum.ts'

const webR = new WebR();
webR.init();
console.info('Installing DDIwR package...');
webR.installPackages(["DDIwR"]).then(() => {
  console.info('DDIwR package installed!');
  state.value = 'idle';
});

export class Parser{
  static async parseFile(file, doneCallback){
    var dataset = new Dataset()

    dataset.fileName = file.name
    dataset.studyName = file.name + " study"
    dataset.studyGroupName = file.name + " group"
    dataset.mimeType = file.type
    dataset.fileSize = file.size
    dataset.lastModified = new Date(file.lastModified).toISOString()
    dataset.sha256 = await checksum(file, "SHA-256")

    const sheetJsSuffixes = ['.xlsx', '.xls', '.ods']
    const ddiwrSuffixes = ['.sav', '.dta', '.sas7bdat']

    if (sheetJsSuffixes.some(suffix => file.name.endsWith(suffix))){
      await Parser.parseSpreadsheet(file, dataset, (d) => doneCallback(d))
    }
    else if (ddiwrSuffixes.some(suffix => file.name.endsWith(suffix))){
      await Parser.parseDDIwR(file, dataset, (d) => doneCallback(d))
    }
    else{
      await Parser.parseDelimitedText(file, dataset, (d) => doneCallback(d))
    }
  }

  static async parseDDIwR(file, dataset, done){
    const reader = new FileReader();
    const basename  = file.name.substr(0, file.name.lastIndexOf('.'));

    reader.onload = async (e) => {
      const contents = e.target.result;
      // write to the webR filesystem
      await webR.FS.writeFile('/home/web_user/' + file.name, new Uint8Array(contents));
      console.debug('File uploaded and written to /home/web_user/'+file.name);
      console.info('run convert with DDIwR...');

      // run the DDIwR conversion to extract DDI-C 2.6 metadata
      await webR.evalR(`DDIwR::convert("`+file.name+`", to="DDI", embed=FALSE)`);

      console.debug('Files done, reading...');

      // read the DDI-C 2.6 XML file from the webR filesystem
      var readDdiResult = await webR.FS.readFile('/home/web_user/'+basename+'.xml');
      var ddiString = new TextDecoder().decode(readDdiResult);
      console.debug('DDI-C 2.6 XML read');

      // read the CSV file from the webR filesystem
      var readCsvResult = await webR.FS.readFile('/home/web_user/'+basename+'.csv');
      var csvString = new TextDecoder().decode(readCsvResult);

      console.debug('CSV read');

      // TODO: this should not be done here
      var vars = readDDiCString(ddiString);
      dataset.columns = vars;
      done(dataset)
      // end TODO

      var results = Papa.parse(csvString);
      if(dataset.firstRowIsHeader){
        results.data.shift()
      }
      dataset.data = results.data;
    };

    await reader.readAsArrayBuffer(file);
  }

  static async parseSpreadsheet(file, dataset, done){
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (e) {
        var fileReaderData = new Uint8Array(reader.result);
        var workbook = XLSX.read(fileReaderData, {type: 'array'});
        var sheet = workbook.Sheets[workbook.SheetNames[0]];

        var arr = XLSX.utils.sheet_to_json(sheet, {header: 1});

        dataset.columns = []
        dataset.delimiter = null
        dataset.linebreak = null

        var columnIds = arr[0]
        if(dataset.firstRowIsHeader){
          arr.shift()
        }
        dataset.data = arr

        for(const [i, c] of columnIds.entries()){
          var column = new DatasetColumn(c)
          column.position = i
          column.values = dataset.data.map(d => d[i])
          column.valuesUnique = [... new Set(column.values)]
          column.valuesUnique.sort(function(a, b){return a-b})
          column.hasIntendedDataType = RepresentationTypes.find(e => e.id === guessDataType(column.valuesUnique))
          dataset.columns.push(column)
        }

        done(dataset)
    }
  }

  static parseDelimtedTextString(string, dataset, done){
    var results = Papa.parse(string);
    dataset.data = results.data
    dataset.delimiter = results.meta.delimiter
    dataset.linebreak = results.meta.linebreak

    var columnIds = results.data[0]
    if(dataset.firstRowIsHeader){
      results.data.shift()
    }
    dataset.data = results.data

    for(let i = 0 ; i < dataset.columns.length ; i++){
      dataset.columns[i].valuesUnique = [... new Set(dataset.data.map(d => d[i+1]))]
      dataset.columns[i].valuesUnique.sort(function(a, b){return a-b})
      dataset.columns[i].hasIntendedDataType = RepresentationTypes.find(e =>
        e.id === guessDataType(dataset.columns[i].valuesUnique)
      )
    }

    done(dataset)
  }

  static async parseDelimitedText(file, dataset, done){
    await Papa.parse(file, {
      complete: function(results) {
        dataset.columns = []
        dataset.errors = results.errors

        dataset.delimiter = results.meta.delimiter
        dataset.linebreak = results.meta.linebreak

        var columnIds = results.data[0]
        if(dataset.firstRowIsHeader){
          results.data.shift()
        }
        dataset.data = results.data

        for(const [i, c] of columnIds.entries()){
          var column = new DatasetColumn(c)
          column.position = i
          column.values = dataset.data.map(d => d[i])
          column.valuesUnique = [... new Set(column.values)]
          column.valuesUnique.sort(function(a, b){return a-b})
          column.hasIntendedDataType = RepresentationTypes.find(e => e.id === guessDataType(column.valuesUnique))
          dataset.columns.push(column)
        }

        done(dataset)
      }
    })
  }
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}


function median_of_arr(arr) {
  const middle = (arr.length + 1) / 2;

  const sorted = [...arr].sort((a, b) => a - b);
  const isEven = sorted.length % 2 === 0;

  return isEven ? (sorted[middle - 1.5]
      + sorted[middle - 0.5]) / 2 :
      sorted[middle - 1];
}

const RepresentationTypes= [
  {id: "String", label: "String / Text", type: "string" },
  {id: "NormalizedString", label: "Normalized string / text", type: "string" },
  {id: "Boolean", label: "Boolean" },
  {id: "Decimal", label: "Decimal", type: "decimal" },
  {id: "Integer", label: "Integer", type: "numeric" },
  {id: "PositiveInteger", label: "Positive integer", type: "numeric" },
  {id: "NegativeInteger", label: "Negative integer", type: "numeric" },
  {id: "NonNegativeInteger", label: "Non - negative integer", type: "numeric" },
  {id: "NonPositiveInteger", label: "Non - positive integer", type: "numeric" },
  {id: "Long", label: "Long", type: "numeric" },
  {id: "Int", label: "Int", type: "numeric" },
  {id: "Short", label: "Short", type: "numeric" },
  {id: "Byte", label: "Byte", type: "numeric" },
  {id: "UnsignedLong", label: "Unsigned long", type: "numeric" },
  {id: "UnsignedInt", label: "Unsigned int", type: "numeric" },
  {id: "UnsignedShort", label: "Unsigned short", type: "numeric" },
  {id: "UnsignedByte", label: "Unsigned byte", type: "numeric" },
  {id: "Float", label: "Float", type: "decimal" },
  {id: "Double", label: "Double", type: "decimal" },
  {id: "DateTime", label: "DateTime", type: "datetime" },
  {id: "Time", label: "Time", type: "datetime" },
  {id: "Date", label: "Date", type: "datetime" },
  {id: "GYearMonth", label: "YearMonth", type: "datetime" },
  {id: "GYear", label: "Year", type: "datetime" },
  {id: "Year", label: "Year", type: "datetime" },
  {id: "GMonthDay", label: "MonthDay", type: "datetime" },
  {id: "GDay", label: "Day", type: "datetime" },
  {id: "GMonth", label: "Month", type: "datetime" },
  {id: "Duration", label: "Duration", type: "datetime" },
  {id: "HexBinary", label: "hexBinary", type: "string" },
  {id: "Base64Binary", label: "base64Binary", type: "string" },
  {id: "AnyURI", label: "anyURI", type: "string" },
  {id: "GeographicLocation", label: "Geographic location", type: "string"},
  {id: "Other", label: "Other" },
];

function CSVToArray(strData, strDelimiter){
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
      (
          // Delimiters.
          "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

          // Quoted fields.
          "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

          // Standard fields.
          "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
      );


  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;


  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )){

      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[ 1 ];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (
          strMatchedDelimiter.length &&
          (strMatchedDelimiter != strDelimiter)
          ){

          // Since we have reached a new row of data,
          // add an empty row to our data array.
          arrData.push( [] );

      }


      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[ 2 ]){

          // We found a quoted value. When we capture
          // this value, unescape any double quotes.
          var strMatchedValue = arrMatches[ 2 ].replace(
              new RegExp( "\"\"", "g" ),
              "\""
              );

      } else {

          // We found a non-quoted value.
          var strMatchedValue = arrMatches[ 3 ];

      }


      // Now that we have our value string, let's add
      // it to the data array.
      arrData[ arrData.length - 1 ].push( strMatchedValue );
  }

  // Return the parsed data.
  return( arrData );
}

function getColumnValues(csv, columnIndex, haveHeader){
  var startRow = 0
  if(haveHeader) startRow = 1;

  var column = [];
  for(var i=startRow; i<csv.length; i++){
     column.push(csv[i][columnIndex]);
  }
  return column;
}

function getColTypes(){
  return [
      {label: "Text", id: "http://rdf-vocabulary.ddialliance.org/cv/DataType/1.1.2/#String"},
      {label: "Integer", id: "http://rdf-vocabulary.ddialliance.org/cv/DataType/1.1.2/#Integer"},
      {label: "Double", id: "http://rdf-vocabulary.ddialliance.org/cv/DataType/1.1.2/#Double"},
      {label: "Date", id: "http://rdf-vocabulary.ddialliance.org/cv/DataType/1.1.2/#Date"},
      {label: "DateTime", id: "http://rdf-vocabulary.ddialliance.org/cv/DataType/1.1.2/#DateTime"}
  ]
}

function isEmpty(value) {
  return value === undefined || value === null || value === ''
}

function guessType(values){
  const intReg = /^(- ?)?\d{1,3}(([. '`]?\d{3})*|([, '`]?\d{3})*)?$/;
  const doubleReg = /^(- ?)?\d{1,3}(([. '`]?\d{3})*(,\d+)|([, '`]?\d{3})*(.\d+))?$/ // /^-?(\d+\.\d*|\.?\d+)$/
  const dateReg = /^\d{4}-(0\d|1[0-2])-([0-2]\d|3[01])$/
  const dateTimeReg = /^(19|20)(\d{2})-(0\d|1[0-2])-([0-2]\d|3[01])[T ]([0-1]\d|2[0-3]):([0-5]\d)(:([0-5]\d)(\.\d{1,3})?)?(Z|[+-]([0-1]\d|2[0-3]):([0-5]\d))?$/

  if(values.every(i => intReg.test(i) || isEmpty(i))) return 'numeric';

  if(values.every(i => doubleReg.test(i) || isEmpty(i))) return 'numeric';

  // TODO: work out a better date test
  if(values.every(i => dateReg.test(i) || isEmpty(i))) return 'date';
  if(values.every(i => dateTimeReg.test(i) || isEmpty(i))) return 'datetime';

  if(values.every(i => typeof i === "string" || isEmpty(i))) return 'text';
  return null;
}

function guessDataType(values) {
  /*
  https://vocabularies.cessda.eu/vocabulary/DataType?lang=en
  unhandled data types:
  // NormalizedString
  // Long
  // Int
  // GDay
  // GMonth
  // Other
  */

  // Handle empty arrays
  if (!values || values.length === 0) {
    return 'String';
  }

  // Helper function to convert value to number for range checks
  const toNumber = (val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }
    return null;
  };

  // Boolean
  if (values.every(i => (/^(?:true|false|1|0)$/i.test(String(i))) || isEmpty(i))) return 'Boolean';

  // Year (check before other numeric types, but only if it's clearly a year pattern)
  // Integer-valued year, e.g., 2005. Can be 4-digit (1900-2099) or 2-digit (00-99)
  // Only recognize as Year if at least one value is a 4-digit year to avoid false positives
  const yearValues = values.filter(i => !isEmpty(i));
  if (yearValues.length > 0) {
    const allMatchYearPattern = yearValues.every(i => {
      const str = String(i);
      return /^(19|20)?\d{2}$/.test(str);
    });
    if (allMatchYearPattern) {
      // Check if at least one is a 4-digit year (1900-2099)
      const hasFourDigitYear = yearValues.some(i => {
        const str = String(i);
        return /^(19|20)\d{2}$/.test(str) && str.length === 4;
      });
      // Only return Year if we have at least one 4-digit year
      // This prevents 2-digit numbers like [10, 12, 32] from being misidentified as Year
      if (hasFourDigitYear) {
        return 'Year';
      }
    }
  }

  // Byte (signed, most restrictive)
  // Whole numbers in the range -128 - 127.
  if (values.every(i => {
    if (isEmpty(i)) return true;
    const num = toNumber(i);
    return num !== null && num >= -128 && num <= 127 && Number.isInteger(num);
  })) return 'Byte';

  // Unsigned byte
  // Whole numbers in the range 0 - 255.
  if (values.every(i => {
    if (isEmpty(i)) return true;
    const num = toNumber(i);
    return num !== null && num >= 0 && num <= 255 && Number.isInteger(num);
  })) return 'UnsignedByte';

  // Short (signed)
  // Whole numbers in the range -32768 - 32767.
  if (values.every(i => {
    if (isEmpty(i)) return true;
    const num = toNumber(i);
    return num !== null && num >= -32768 && num <= 32767 && Number.isInteger(num);
  })) return 'Short';

  // Unsigned short
  // Whole numbers in the range 0 - 65535.
  if (values.every(i => {
    if (isEmpty(i)) return true;
    const num = toNumber(i);
    return num !== null && num >= 0 && num <= 65535 && Number.isInteger(num);
  })) return 'UnsignedShort';

  // Unsigned int
  // Whole numbers in the range 0 - 4294967295.
  if (values.every(i => {
    if (isEmpty(i)) return true;
    const num = toNumber(i);
    return num !== null && num >= 0 && num <= 4294967295 && Number.isInteger(num);
  })) return 'UnsignedInt';

  // Unsigned long
  // Whole numbers in the range 0 - 18446744073709551615.
  // Note: JavaScript can only safely represent integers up to Number.MAX_SAFE_INTEGER
  if (values.every(i => {
    if (isEmpty(i)) return true;
    const num = toNumber(i);
    return num !== null && num >= 0 && num <= Number.MAX_SAFE_INTEGER && Number.isInteger(num);
  })) return 'UnsignedLong';

  const regex = {
      PositiveInteger: /^[1-9]\d*$/,
      NegativeInteger: /^-\d+$/,
      NonNegativeInteger: /^\d+$/,
      NonPositiveInteger: /^(0|-\d+)$/,
      Integer: /^-?\d+$/,
      // Decimal: Must have at least one digit, allows optional sign and decimal separator (comma or dot)
      Decimal: /^[+-]?(\d+([.,]\d+)?|[.,]\d+)$/,
      // Double / Float: Supports scientific notation, INF, and optional sign with space
      // Pattern: optional sign+space, then either: number with optional decimal and scientific notation, or INF
      Double: /^(- ?)?(\d+([.,]\d+)?([eE][+-]?\d+)?|\d+[eE][+-]?\d+|INF)$/,

      DateTime: /^(19|20)(\d{2})-(0\d|1[0-2])-([0-2]\d|3[01])[T ]([0-1]\d|2[0-3]):([0-5]\d)(:([0-5]\d)(\.\d{1,3})?)?(Z|[+-]([0-1]\d|2[0-3]):([0-5]\d))?$/,
      // Date
      // Integer-valued year, month, day, and time zone hour and minutes, e.g., 2003-06-30-05:00 (30 June 2003 Eastern Standard Time U.S.).
      Date: /^(19|20)(\d{2})-(0\d|1[0-2])-([0-2]\d|3[01])(-([0-1]\d|2[0-3]):([0-5]\d))?$/,
      // Time
      // Left-truncated dateTime, e.g., 13:20:00-05:00 (1:20 pm for Eastern Standard Time U.S.).
      Time: /^([0-1]?\d|2[0-3]):([0-5]\d)(:([0-5]\d)(\.\d{1,3})?)?([+-]([0-1]?\d|2[0-3]):([0-5]\d))?( ?(a|p)\.?m\.?)?$/,
      // YearMonth
      // Integer-valued year and month, e.g., 2004-11. Month must be 1-12 (allows single or double digit)
      GYearMonth: /^(19|20)\d{2}-(0?[1-9]|1[0-2])$/,
      // MonthDay
      // Integer-valued month and day, e.g., 12-31. Month 1-12, Day 1-31 (allows single or double digit, note: doesn't validate day count per month)
      GMonthDay: /^(0?[1-9]|1[0-2])-([0-2]?\d|3[01])$/,

      HexBinary: /^(?:[0-9a-fA-F]{2})+$/,
      Base64Binary: /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
      AnyURI: /^(?:(?:ftps?|https?|wss?):\/\/(?:(?:[a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/\S*)?|mailto:[^\s@]+@[^\s@]+\.[^\s@]+)$/,
      Duration: /^-?P(?!T?$)(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?!$)(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/,
  }

  // Check Date instances before regex matching (Date objects should be converted to strings for regex)
  if (values.every(i => {
    if (isEmpty(i)) return true;
    if (i instanceof Date) return true;
    const str = String(i);
    return regex['DateTime'].test(str);
  })) return 'DateTime';

  if (values.every(i => {
    if (isEmpty(i)) return true;
    if (i instanceof Date) return true;
    const str = String(i);
    return regex['Date'].test(str);
  })) return 'Date';

  if (values.every(i => {
    if (isEmpty(i)) return true;
    if (i instanceof Date) return true;
    const str = String(i);
    return regex['Time'].test(str);
  })) return 'Time';

  // Check other regex patterns
  let result = null;
  for (let regexKey in regex) {
      if (values.every(i => {
        if (isEmpty(i)) return true;
        const str = String(i);
        return regex[regexKey].test(str);
      })) {
          result = regexKey;
          break;
      }
  }
  if (result !== null) {
      return result;
  }

  // String
  // Finite sequences of characters. A character is an atomic unit of written communication; it is not further specified except to note that every character has a corresponding Universal Character Set code point (which is an integer).
  if(values.every(i => typeof i === "string" || isEmpty(i))) return 'String';

  return 'Other';
}

function guessDelimiter(csvContent){
  for(const delimiter of [',', ';', '|', '\t']){
    var csv = CSVToArray(csvContent, delimiter)
    // TODO: do a bit more intelligent check...
    if(csv[0].length > 1 && csv.length > 1) return delimiter;
  }

  return ','
}

export { guessDataType, guessType, guessDelimiter, RepresentationTypes }
