const DataType = {
    Text: "text"
  }

  class Dataset{
    data = [[]]
    fileName = null
    studyName
    studyDescription = "Please describe the content and Method of this study."
    studyGroupName
    studyGroupDescription = "Please describe the structure of this study group."
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
    uuid = window.crypto.randomUUID()
    dataCollectionUuid = window.crypto.randomUUID()
    associatedQuestionnaire = new Questionnaire(questionnaireExample)

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
    role
    values = []
    /**
     * list of code values
     * @type {CodeValue[]}
     * @public
     */
    codeValues = []
    coded = false

    /**
     * varformat
     * @type {VarFormat}
     * @public
     */
    varFormat

    responseUnit
    valuesUnique = []
    hasIntendedDataType
    dataType = DataType.Text
    minValue
    maxValue
    uuid = window.crypto.randomUUID()
    codeListUuid = window.crypto.randomUUID()
    categorySchemeUuid = window.crypto.randomUUID()

    constructor(id){
      this.id = id
      this.name=id
      this.varFormat = new VarFormat()
    }

    getConceptScheme(){
      var conceptScheme = {
        '@id' : '#conceptScheme-' + this.uuid,
        '@type' : "skos:ConceptScheme",
        'skos:hasTopConcept' : []
      }
      for(const v of this.getUniqueValues()){
        conceptScheme['skos:hasTopConcept'].push('#'+this.id + '-concept-' + v)
      }
      return conceptScheme
    }

    getUniqueValues(){
      return [... new Set(this.values)]
    }

    createCodeList(){
      if(!this.coded){
        this.codeValues = []
        return
      }
      for(const v of this.valuesUnique){
        this.codeValues.push(new CodeValue({"value": v, "label": null, "frequency": this.values.filter(e => e === v).length}))
      }
    }
  }

  class VarFormat{
    type
    schema
    otherCategory
  }
