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
    /**
     * Question object for the variable
     * @type {Question}
     * @public
     */
    question
  
    constructor(id){
      this.id = id
      this.name=id
      this.question = new Question()
    }
  }
  
  class Question{
    // TODO: properties for questions from DDI-L & DDI-C
  }