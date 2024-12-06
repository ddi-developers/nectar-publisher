function toDdiLXml(input){
    var nsddi = "ddi:instance:3_3"
    var nss = "ddi:studyunit:3_3"
    var nsr = "ddi:reusable:3_3"
    var nspi = "ddi:physicalinstance:3_3"
    var nsl = "ddi:logicalproduct:3_3"
    var agency = "int.example"

    var xmlDoc = document.implementation.createDocument(nsddi, "ddi:FragmentInstance", null);

    var fragmentInstance = xmlDoc.getElementsByTagName("ddi:FragmentInstance")[0]
    
    fragmentInstance.setAttribute("xmlns:s", "ddi:studyunit:3_3")
    fragmentInstance.setAttribute("xmlns:r", "ddi:reusable:3_3")
    fragmentInstance.setAttribute("xmlns:pi", "ddi:physicalinstance:3_3")
    fragmentInstance.setAttribute("xmlns:l", "ddi:logicalproduct:3_3")

    var uuidSU = window.crypto.randomUUID()
    var uuidPI = input.uuid
    var uuidLP = window.crypto.randomUUID()
    var uuidVS = window.crypto.randomUUID()

	var topLevelReference = xmlDoc.createElementNS(nsddi, "ddi:TopLevelReference")
	topLevelReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	topLevelReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", uuidSU))
	topLevelReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	topLevelReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "StudyUnit"))
	fragmentInstance.appendChild(topLevelReference)
			
	var studyUnitFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
	var studyUnit = xmlDoc.createElementNS(nspi, "s:StudyUnit")
	studyUnit.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + uuidSU + ":1.0.0"))
	studyUnit.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	studyUnit.appendChild(createTextNode(xmlDoc, nsr, "r:ID", uuidSU))
	studyUnit.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	studyUnit.appendChild(createTextNode(xmlDoc, nsr, "r:Abstract", input.studyDescription))
	var physicalInstanceReference = xmlDoc.createElementNS(nsr, "r:PhysicalInstanceReference")
	physicalInstanceReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	physicalInstanceReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", uuidPI))
	physicalInstanceReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	physicalInstanceReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "PhysicalInstance"))
	studyUnit.appendChild(physicalInstanceReference)
	var logicalProductReference = xmlDoc.createElementNS(nsr, "r:LogicalProductReference")
	logicalProductReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	logicalProductReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", uuidLP))
	logicalProductReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	logicalProductReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "LogicalProduct"))
	studyUnit.appendChild(logicalProductReference)
	studyUnitFragment.appendChild(studyUnit)
	fragmentInstance.appendChild(studyUnitFragment)

	var physicalInstanceFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
	var physicalInstance = xmlDoc.createElementNS(nspi, "pi:PhysicalInstance")
	physicalInstance.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + uuidPI + ":1.0.0"))
	physicalInstance.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	physicalInstance.appendChild(createTextNode(xmlDoc, nsr, "r:ID", uuidPI))
	physicalInstance.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	var dataFingerprint = xmlDoc.createElementNS(nspi, "pi:DataFingerprint")
	dataFingerprint.appendChild(createTextNode(xmlDoc, nspi, "pi:AlgorithmSpecification", "SHA-256"))
	dataFingerprint.appendChild(createTextNode(xmlDoc, nspi, "pi:DataFingerprintValue", input.sha256))
	physicalInstance.appendChild(dataFingerprint)
	var dataFileIdentification = xmlDoc.createElementNS(nspi, "pi:DataFileIdentification")
	dataFileIdentification.appendChild(createTextNode(xmlDoc, nspi, "pi:DataFileURI", "file:///" + input.fileName))
	dataFileIdentification.appendChild(createTextNode(xmlDoc, nsr, "r:SizeInBytes", input.fileSize))
	physicalInstance.appendChild(dataFileIdentification)
	physicalInstanceFragment.appendChild(physicalInstance)
	fragmentInstance.appendChild(physicalInstanceFragment)

	var logicalProductFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
	var logicalProduct = xmlDoc.createElementNS(nsl, "l:LogicalProduct")
	logicalProduct.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + uuidLP + ":1.0.0"))
	logicalProduct.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	logicalProduct.appendChild(createTextNode(xmlDoc, nsr, "r:ID", uuidLP))
	logicalProduct.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	var variableSchemeReference = xmlDoc.createElementNS(nsr, "r:VariableSchemeReference")
	variableSchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	variableSchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", uuidVS))
	variableSchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	variableSchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "VariableScheme"))
	logicalProduct.appendChild(variableSchemeReference)
	logicalProductFragment.appendChild(logicalProduct)
	fragmentInstance.appendChild(logicalProductFragment)

	var variableSchemeFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
	var variableScheme = xmlDoc.createElementNS(nspi, "l:VariableScheme")
	variableScheme.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + uuidVS + ":1.0.0"))
	variableScheme.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	variableScheme.appendChild(createTextNode(xmlDoc, nsr, "r:ID", uuidVS))
	variableScheme.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
    for(const column of input.columns){
        var variableReference = xmlDoc.createElementNS(nsr, "r:VariableReference")
        variableReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        variableReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", column.uuid))
        variableReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        variableReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "Variable"))
        variableScheme.appendChild(variableReference)
    }
	variableSchemeFragment.appendChild(variableScheme)
	fragmentInstance.appendChild(variableSchemeFragment)

    for(const column of input.columns){
    	var variableFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
        var variable = xmlDoc.createElementNS(nsl, "l:Variable")
    	variable.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + column.uuid + ":1.0.0"))
        variable.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        variable.appendChild(createTextNode(xmlDoc, nsr, "r:ID", column.uuid))
        variable.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        var variableName = xmlDoc.createElementNS(nsl, "l:VariableName")
        variableName.appendChild(createTextNode(xmlDoc, nsr, "r:String", column.name))
        variable.appendChild(variableName)
        if(column.label){
            var variableLabel = xmlDoc.createElementNS(nsr, "r:Label")
            var variableLabelContent = xmlDoc.createElementNS(nsr, "r:Content")
            variableLabelContent.appendChild(createTextNode(xmlDoc, nsr, "r:Text", column.label))
            variableLabel.appendChild(variableLabelContent)
            variable.appendChild(variableLabel)
        }
        if(column.description){
            var variableDesc = xmlDoc.createElementNS(nsr, "r:Description")
            var variableDescContent = xmlDoc.createElementNS(nsr, "r:Content")
            variableDescContent.appendChild(createTextNode(xmlDoc, nsr, "r:Text", column.description))
            variableDesc.appendChild(variableDescContent)
            variable.appendChild(variableDesc)
        }
        var variableRepresentation = xmlDoc.createElementNS(nsl, "l:VariableRepresentation")
        if(column.coded) {
            var codeRepresentation = xmlDoc.createElementNS(nsr, "r:CodeRepresentation")
            codeRepresentation.appendChild(createTextNode(xmlDoc, nsr, "r:RecommendedDataType", column.hasIntendedDataType.id))
            var codeListReference = xmlDoc.createElementNS(nsr, "r:CodeListReference")
            codeListReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            codeListReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", column.codeListUuid))
            codeListReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            codeListReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "CodeList"))
            codeRepresentation.appendChild(codeListReference)
            variableRepresentation.appendChild(codeRepresentation)
        }
        else if(column.hasIntendedDataType.type == 'numeric' || column.hasIntendedDataType.type == 'decimal' || column.hasIntendedDataType.type == 'boolean') {
            var numericRepresentation = xmlDoc.createElementNS(nsr, "r:NumericRepresentation")
            numericRepresentation.appendChild(createTextNode(xmlDoc, nsr, "r:NumericTypeCode", column.hasIntendedDataType.id))
            variableRepresentation.appendChild(numericRepresentation)
        }
        else if(column.hasIntendedDataType.type == 'string') {
            var textRepresentation = xmlDoc.createElementNS(nsr, "r:TextRepresentation")
            textRepresentation.appendChild(createTextNode(xmlDoc, nsr, "r:RecommendedDataType", column.hasIntendedDataType.id))
            variableRepresentation.appendChild(textRepresentation)
        }
        else if(column.hasIntendedDataType.type == 'datetime') {
            var datetimeRepresentation = xmlDoc.createElementNS(nsr, "r:DateTimeRepresentation")
            datetimeRepresentation.appendChild(createTextNode(xmlDoc, nsr, "r:RecommendedDataType", column.hasIntendedDataType.id))
            variableRepresentation.appendChild(datetimeRepresentation)
        }
        variable.appendChild(variableRepresentation)
        variableFragment.appendChild(variable)
        fragmentInstance.appendChild(variableFragment)
    }

    for(const column of input.columns){
        if(column.coded) {
            var codeListFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
            var codeList = xmlDoc.createElementNS(nsl, "l:CodeList")
        	codeList.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + column.codeListUuid + ":1.0.0"))
            codeList.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            codeList.appendChild(createTextNode(xmlDoc, nsr, "r:ID", column.codeListUuid))
            codeList.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            var categorySchemeReference = xmlDoc.createElementNS(nsr, "r:CategorySchemeReference")
            categorySchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            categorySchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", column.categorySchemeUuid))
            categorySchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            categorySchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "CategoryScheme"))
            codeList.appendChild(categorySchemeReference)
            for(const codeValue of column.codeValues){
                var code = xmlDoc.createElementNS(nsl, "l:Code")
            	code.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + codeValue.uuid + ":1.0.0"))
                code.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
                code.appendChild(createTextNode(xmlDoc, nsr, "r:ID", codeValue.uuid))
                code.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
                var categoryReference = xmlDoc.createElementNS(nsr, "r:CategoryReference")
                categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
                categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", codeValue.categoryUuid))
                categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
                categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "Category"))
                code.appendChild(categoryReference)
                code.appendChild(createTextNode(xmlDoc, nsl, "l:CodeValue", codeValue.value))
                codeList.appendChild(code)
            }
            codeListFragment.appendChild(codeList)
            fragmentInstance.appendChild(codeListFragment)
        }
    }

    for(const column of input.columns){
        if(column.coded) {
            var categorySchemeFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
            var categoryScheme = xmlDoc.createElementNS(nsl, "l:CatrgoryScheme")
        	categoryScheme.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + column.categorySchemeUuid + ":1.0.0"))
            categoryScheme.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            categoryScheme.appendChild(createTextNode(xmlDoc, nsr, "r:ID", column.categorySchemeUuid))
            categoryScheme.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            for(const codeValue of column.codeValues){
                var categoryReference = xmlDoc.createElementNS(nsr, "r:CategoryReference")
                categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
                categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", codeValue.categoryUuid))
                categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
                categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "Category"))
                categoryScheme.appendChild(categoryReference)
            }
            categorySchemeFragment.appendChild(categoryScheme)
            fragmentInstance.appendChild(categorySchemeFragment)
            for(const codeValue of column.codeValues){
                var categoryFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
                var category = xmlDoc.createElementNS(nsl, "l:Category")
            	category.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + codeValue.categoryUuid + ":1.0.0"))
                category.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
                category.appendChild(createTextNode(xmlDoc, nsr, "r:ID", codeValue.categoryUuid))
                category.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
                var categoryLabel = xmlDoc.createElementNS(nsr, "r:Label")
                var categoryLabelContent = xmlDoc.createElementNS(nsr, "r:Content")
                categoryLabelContent.appendChild(createTextNode(xmlDoc, nsr, "r:Text", codeValue.label))
                categoryLabel.appendChild(categoryLabelContent)
                category.appendChild(categoryLabel)
                categoryFragment.appendChild(category)
                fragmentInstance.appendChild(categoryFragment)
            }
        }
    }

    var prolog = '<?xml version="1.0" encoding="UTF-8"?>'
    var xmlString = new XMLSerializer().serializeToString(xmlDoc)
    return prolog + "\n" + formatXml(xmlString)
}