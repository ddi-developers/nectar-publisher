const DataType = {
  Text: "text"
}

class Dataset{
  data = [[]]
  fileName = null
  fileSize
  mimeType
  sha256
  delimiter
  linebreak
  lastModified
  encoding = "utf-8"
  firstRowIsHeader = true
  errors = []
  /**
   * list of columns in the dataset
   * @type {DatasetColumn[]}
   * @public
   */
  columns = []

  constructor(input, fileName, mimeType, delimiter = undefined, firstRowIsHeader = true){
    this.fileName = fileName
    this.fileHash = { sha256: "" }
    this.mimeType = mimeType
    this.firstRowIsHeader = firstRowIsHeader
    if(delimiter == undefined){
      this.delimiter = "," //should use the detector
    }
  }

  _parseData(){

  }
}

class DatasetColumn{
  position
  id
  name
  label
  description
  values = []
  valuesUnique
  hasIntendedDataType
  dataType = DataType.Text
  constructor(id){
    this.id = id
    this.name=id
  }
}

class Parser{
  static async parseFile(file, doneCallback){
    var dataset = new Dataset()

    dataset.fileName = file.name
    dataset.mimeType = file.type
    dataset.fileSize = file.size
    dataset.lastModified = new Date(file.lastModified).toISOString()
    dataset.sha256 = await checksum(file, "SHA-256")

    const sheetJsSuffixes = ['.xlsx', '.xls', '.ods']

    if (sheetJsSuffixes.some(suffix => file.name.endsWith(suffix))){
      await Parser.parseSpreadsheet(file, dataset, (d) => doneCallback(d))
    }else{
        await Parser.parseDelimitedText(file, dataset, (d) => doneCallback(d))
    }
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
          column.valuesUnique = [... new Set(dataset.data.map(d => d[i]))]
          column.valuesUnique.sort()
          column.hasIntendedDataType = guessType(column.valuesUnique)
          dataset.columns.push(column)
        }

        done(dataset)
    }
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
          column.valuesUnique = [... new Set(dataset.data.map(d => d[i]))]
          column.valuesUnique.sort()
          column.hasIntendedDataType = guessType(column.valuesUnique)
          dataset.columns.push(column)
        }

        done(dataset)
      }
    })
  }
}

function copyTextToClipboard(text){
  navigator.clipboard.writeText(text).then(() => {
    console.log("Content copied to clipboard");
  },() => {
      console.error("Failed to copy to clipboard");
  });
}

function guessType(values){
  var numRegEx = /^\d*(\.\d+)?$/
  var intReg = /^\d+$/;
  var doubleReg = /\d+\.\d*|\.?\d+/
  var dateReg = /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/

  if(values.every(i => intReg.test(i))) return 'numeric';

  if(values.every(i => doubleReg.test(i))) return 'numeric';

  if(values.every(i => numRegEx.test(i))) return 'numeric';

  // TODO: work out a better date test
  if(values.every(i => dateReg.test(i))) return 'datetime';

  if(values.every(i => typeof i === "string")) return  'text';
  return 'other';
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

async function checksum(file, type){
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(type, arrayBuffer); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function median_of_arr(arr) {
  const middle = (arr.length + 1) / 2;

  const sorted = [...arr].sort((a, b) => a - b);
  const isEven = sorted.length % 2 === 0;

  return isEven ? (sorted[middle - 1.5]
      + sorted[middle - 0.5]) / 2 :
      sorted[middle - 1];
}
var arr = [1, 4, 7, 9];
console.log(median_of_arr(arr));

function getAppMetadata(){
  return JSON.parse(document.head.querySelector('script[type="application/ld+json"]').innerText);
}
