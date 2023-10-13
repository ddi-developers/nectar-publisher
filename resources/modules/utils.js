const DataType = {
	Numreric: "number",
	Autumn: "autumn",
  Text: "text"
}

class Dataset{
  raw
  fileName
  mimeType
  delimiter
  encoding = "utf-8"
  firstRowIsHeader = true
  /**
   * list of columns in the dataset
   * @type {DatasetColumn[]}
   * @public
   */
  columns = []

  constructor(input, fileName, mimeType, delimiter = undefined, firstRowIsHeader = true){
    this.raw = input
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
  values = []
  valuesUnique
  dataType = DataType.Text
}

class Parser{

  static parseDelimitedText(input){
    return new Dataset()
  }

  static hello(input) {
    return "hello " + input
  }
}

