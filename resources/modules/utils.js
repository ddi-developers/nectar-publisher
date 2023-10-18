const DataType = {
	Numreric: "number",
	Autumn: "autumn",
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
  values = []
  valuesUnique
  dataType = DataType.Text
  constructor(id){
    this.id = id
    this.name=id
  }
}

class Parser{
  static async parseFile(file, doneCallback){
    if(file.name.endsWith(".xlsx")){
      await Parser.parseSpreadsheet(file, (d) => doneCallback(d))
    }else{
        await Parser.parseDelimitedText(file, (d) => doneCallback(d))
    }
  }
  static async parseSpreadsheet(file, done){
    console.log("Parse Spreadsheet ", file)
    var dataset = new Dataset()
    dataset.fileName = file.name
    dataset.sha256 = await checksum(file, "SHA-256")
       
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (e) {
        var fileReaderData = new Uint8Array(reader.result);
        var workbook = XLSX.read(fileReaderData, {type: 'array'});
        var sheet = workbook.Sheets[workbook.SheetNames[0]];

        var arr = XLSX.utils.sheet_to_json(sheet, {header: 1});
        console.log("sheet array", arr)
     
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
          dataset.columns.push(column)
        }

        console.log(dataset)

        done(dataset)
    }

    console.log("sheet ")
  }

  static async parseDelimitedText(file, done){
    var dataset = new Dataset()

    dataset.fileName = file.name
    dataset.mimeType = file.type
    dataset.fileSize = file.size
    dataset.lastModified = new Date(file.lastModified).toISOString()
    dataset.sha256 = await checksum(file, "SHA-256")

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

async function checksum(file, type){
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(type, arrayBuffer); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function getAppMetadata(){
  return JSON.parse(document.head.querySelector('script[type="application/ld+json"]').innerText);
}