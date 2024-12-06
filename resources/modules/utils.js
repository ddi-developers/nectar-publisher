class Parser{
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

function copyTextToClipboard(text){
  navigator.clipboard.writeText(text).then(() => {
    console.log("Content copied to clipboard");
  },() => {
      console.error("Failed to copy to clipboard");
  });
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

function getAppMetadata(){
  return JSON.parse(document.head.querySelector('script[type="application/ld+json"]').innerText);
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
