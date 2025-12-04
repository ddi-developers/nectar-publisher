function toDdiLXml(input){
    var nsddi = "ddi:instance:3_3"
    var nss = "ddi:studyunit:3_3"
    var nsr = "ddi:reusable:3_3"
    var nspi = "ddi:physicalinstance:3_3"
    var nsl = "ddi:logicalproduct:3_3"
    var nsd = "ddi:datacollection:3_3"
    var agency = "int.example"

    var xmlDoc = document.implementation.createDocument(nsddi, "ddi:FragmentInstance", null);

    var fragmentInstance = xmlDoc.getElementsByTagName("ddi:FragmentInstance")[0]
    
    fragmentInstance.setAttribute("xmlns:s", "ddi:studyunit:3_3")
    fragmentInstance.setAttribute("xmlns:r", "ddi:reusable:3_3")
    fragmentInstance.setAttribute("xmlns:pi", "ddi:physicalinstance:3_3")
    fragmentInstance.setAttribute("xmlns:l", "ddi:logicalproduct:3_3")
    fragmentInstance.setAttribute("xmlns:d", "ddi:datacollection:3_3")

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
	var dataCollectionReference = xmlDoc.createElementNS(nsr, "r:DataCollectionReference")
	dataCollectionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	dataCollectionReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.dataCollectionUuid))
	dataCollectionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	dataCollectionReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "DataCollection"))
	studyUnit.appendChild(dataCollectionReference)
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

	var dataCollectionFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
	var dataCollection = xmlDoc.createElementNS(nsd, "d:DataCollection")
	dataCollection.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + input.dataCollectionUuid + ":1.0.0"))
	dataCollection.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	dataCollection.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.dataCollectionUuid))
	dataCollection.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	var instrumentReference = xmlDoc.createElementNS(nsr, "r:InstrumentReference")
	instrumentReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	instrumentReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.associatedQuestionnaire.uuid))
	instrumentReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	instrumentReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "Instrument"))
	dataCollection.appendChild(instrumentReference)
	dataCollectionFragment.appendChild(dataCollection)
	fragmentInstance.appendChild(dataCollectionFragment)

	var instrumentFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
	var instrument = xmlDoc.createElementNS(nsd, "d:Instrument")
	instrument.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + input.associatedQuestionnaire.uuid + ":1.0.0"))
	instrument.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	instrument.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.associatedQuestionnaire.uuid))
	instrument.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	var controlConstructReference = xmlDoc.createElementNS(nsr, "r:ControlConstructReference")
	controlConstructReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	controlConstructReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.associatedQuestionnaire.sequenceUuid))
	controlConstructReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	controlConstructReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "Sequence"))
	instrument.appendChild(controlConstructReference)
	instrumentFragment.appendChild(instrument)
	fragmentInstance.appendChild(instrumentFragment)

	var sequenceFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
	var sequence = xmlDoc.createElementNS(nsd, "d:Sequence")
	sequence.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + input.associatedQuestionnaire.sequenceUuid + ":1.0.0"))
	sequence.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	sequence.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.associatedQuestionnaire.sequenceUuid))
	sequence.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
    for(const question of input.associatedQuestionnaire.questions){
        var controlConstructReference = xmlDoc.createElementNS(nsr, "r:ControlConstructReference")
        controlConstructReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        controlConstructReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", question.constructUuid))
        controlConstructReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        controlConstructReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "QuestionConstruct"))
        sequence.appendChild(controlConstructReference)
    }
	sequenceFragment.appendChild(sequence)
	fragmentInstance.appendChild(sequenceFragment)

    for(const question of input.associatedQuestionnaire.questions){
        var questionConstructFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
        var questionConstruct = xmlDoc.createElementNS(nsd, "d:QuestionConstruct")
        questionConstruct.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + question.constructUuid + ":1.0.0"))
        questionConstruct.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        questionConstruct.appendChild(createTextNode(xmlDoc, nsr, "r:ID", question.constructUuid))
        questionConstruct.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        if(question.interviewerInstructionReference != null) {
            var instructionReference = xmlDoc.createElementNS(nsr, "r:InterviewInstructionReference")
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", question.interviewerInstructionReference))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "Instruction"))
            questionConstruct.appendChild(instructionReference)
        }
        if(question.programmingInstructionReference != null) {
            var instructionReference = xmlDoc.createElementNS(nsr, "r:InterviewerInstructionReference")
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", question.programmingInstructionReference))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "Instruction"))
            questionConstruct.appendChild(instructionReference)
        }
        var questionReference = xmlDoc.createElementNS(nsr, "r:QuestionReference")
        questionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        questionReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", question.uuid))
        questionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        if(question.multipleAnswers) {
            questionReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "QuestionGrid"))
        }
        else {
            questionReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "QuestionItem"))
        }
        questionConstruct.appendChild(questionReference)
        questionConstructFragment.appendChild(questionConstruct)
        fragmentInstance.appendChild(questionConstructFragment)
    }

    for(const question of input.associatedQuestionnaire.questions){
        var questionFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
        var qst
        if(question.multipleItems) {
            qst = xmlDoc.createElementNS(nsd, "d:QuestionGrid")
        }
        else {
            qst = xmlDoc.createElementNS(nsd, "d:QuestionItem")
        }
        qst.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + question.uuid + ":1.0.0"))
        qst.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        qst.appendChild(createTextNode(xmlDoc, nsr, "r:ID", question.uuid))
        qst.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        var questionText = xmlDoc.createElementNS(nsd, "d:QuestionText")
        var literalText = xmlDoc.createElementNS(nsd, "d:LiteralText")
        literalText.appendChild(createTextNode(xmlDoc, nsd, "d:Text", question.questionText))
        questionText.appendChild(literalText)
        qst.appendChild(questionText)
        var domain
        if(question.answerType == 'numeric') {
            domain = xmlDoc.createElementNS(nsd, "d:NumericDomain")

        }
        else if(question.answerType == 'datetime') {
            domain = xmlDoc.createElementNS(nsd, "d:DateTimeDomain")
        }
        else if(question.answerType == 'string') {
            domain = xmlDoc.createElementNS(nsd, "d:TextDomain")
        }
        else {
            domain = xmlDoc.createElementNS(nsd, "d:CodeDomain")
            var codeListReference = xmlDoc.createElementNS(nsr, "r:CodeListReference")
            codeListReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            codeListReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", question.answerCodesReference))
            codeListReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            codeListReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "CodeList"))
            domain.appendChild(codeListReference)

        }
        if(question.multipleItems) {
            var gridDimension = xmlDoc.createElementNS(nsd, "d:GridDimension")
            gridDimension.setAttribute("rank", "1")
            gridDimension.setAttribute("displayCode", "true")
            gridDimension.setAttribute("displayLabel", "true")
            var itemDomain = xmlDoc.createElementNS(nsd, "d:CodeDomain")
            var itemCodeListReference = xmlDoc.createElementNS(nsr, "r:CodeListReference")
            itemCodeListReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            itemCodeListReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", question.answerCodesReference))
            itemCodeListReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            itemCodeListReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "CodeList"))
            itemDomain.appendChild(itemCodeListReference)
            gridDimension.appendChild(itemDomain)
            qst.appendChild(gridDimension)
            var structuredMixedGridResponseDomain = xmlDoc.createElementNS(nsd, "d:StructuredMixedGridResponseDomain")
            var gridResponseDomain = xmlDoc.createElementNS(nsd, "d:GridResponseDomain")
            gridDimension.setAttribute("rank", "1")

            gridResponseDomain.appendChild(domain)
            structuredMixedGridResponseDomain.appendChild(gridResponseDomain)
            qst.appendChild(structuredMixedGridResponseDomain)

        }
        else {
            qst.appendChild(domain)
        }
        if(question.respondentInstructionReference != null) {
            var instructionReference = xmlDoc.createElementNS(nsr, "r:InterviewerInstructionReference")
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", question.respondentInstructionReference))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "Instruction"))
            qst.appendChild(instructionReference)
        }
        questionFragment.appendChild(qst)
        fragmentInstance.appendChild(questionFragment)
    }

    for(const codeValues of input.associatedQuestionnaire.items){
        var codeListFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
        var codeList = xmlDoc.createElementNS(nsl, "l:CodeList")
        codeList.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + codeValues.uuid + ":1.0.0"))
        codeList.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        codeList.appendChild(createTextNode(xmlDoc, nsr, "r:ID", codeValues.uuid))
        codeList.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        var categorySchemeReference = xmlDoc.createElementNS(nsr, "r:CategorySchemeReference")
        categorySchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        categorySchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", codeValues.categorySchemeUuid))
        categorySchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        categorySchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "CategoryScheme"))
        codeList.appendChild(categorySchemeReference)
        for(const codeValue of codeValues.codeValues){
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

    for(const codeValues of input.associatedQuestionnaire.items){
        var categorySchemeFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
        var categoryScheme = xmlDoc.createElementNS(nsl, "l:CatrgoryScheme")
        categoryScheme.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + codeValues.categorySchemeUuid + ":1.0.0"))
        categoryScheme.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        categoryScheme.appendChild(createTextNode(xmlDoc, nsr, "r:ID", codeValues.categorySchemeUuid))
        categoryScheme.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        for(const codeValue of codeValues.codeValues){
            var categoryReference = xmlDoc.createElementNS(nsr, "r:CategoryReference")
            categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", codeValue.categoryUuid))
            categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "Category"))
            categoryScheme.appendChild(categoryReference)
        }
        categorySchemeFragment.appendChild(categoryScheme)
        fragmentInstance.appendChild(categorySchemeFragment)
        for(const codeValue of codeValues.codeValues){
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

    for(const codeValues of input.associatedQuestionnaire.answers){
        var codeListFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
        var codeList = xmlDoc.createElementNS(nsl, "l:CodeList")
        codeList.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + codeValues.uuid + ":1.0.0"))
        codeList.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        codeList.appendChild(createTextNode(xmlDoc, nsr, "r:ID", codeValues.uuid))
        codeList.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        var categorySchemeReference = xmlDoc.createElementNS(nsr, "r:CategorySchemeReference")
        categorySchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        categorySchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", codeValues.categorySchemeUuid))
        categorySchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        categorySchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "CategoryScheme"))
        codeList.appendChild(categorySchemeReference)
        for(const codeValue of codeValues.codeValues){
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

    for(const codeValues of input.associatedQuestionnaire.answers){
        var categorySchemeFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
        var categoryScheme = xmlDoc.createElementNS(nsl, "l:CatrgoryScheme")
        categoryScheme.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + codeValues.categorySchemeUuid + ":1.0.0"))
        categoryScheme.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        categoryScheme.appendChild(createTextNode(xmlDoc, nsr, "r:ID", codeValues.categorySchemeUuid))
        categoryScheme.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        for(const codeValue of codeValues.codeValues){
            var categoryReference = xmlDoc.createElementNS(nsr, "r:CategoryReference")
            categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", codeValue.categoryUuid))
            categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            categoryReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "Category"))
            categoryScheme.appendChild(categoryReference)
        }
        categorySchemeFragment.appendChild(categoryScheme)
        fragmentInstance.appendChild(categorySchemeFragment)
        for(const codeValue of codeValues.codeValues){
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

    if(input.associatedQuestionnaire.interviewerInstructions) {
        var iisFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
        var iis = xmlDoc.createElementNS(nsd, "d:InterviewerInstructionScheme")
        iis.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + input.associatedQuestionnaire.intervInstrSchemeUuid + ":1.0.0"))
        iis.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        iis.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.associatedQuestionnaire.intervInstrSchemeUuid))
        iis.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        var label = xmlDoc.createElementNS(nsr, "r:Label")
        var labelContent = xmlDoc.createElementNS(nsr, "r:Content")
        labelContent.appendChild(createTextNode(xmlDoc, nsr, "r:Text", 'target audience - Interviewer'))
        label.appendChild(labelContent)
        iis.appendChild(label)
        for(const instruction of input.associatedQuestionnaire.interviewerInstructions){
            var instructionReference = xmlDoc.createElementNS(nsr, "r:InterviewerInstructionReference")
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", instruction.uuid))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "Instruction"))
            iis.appendChild(instructionReference)
        }
        iisFragment.appendChild(iis)
        fragmentInstance.appendChild(iisFragment)

        for(const instruction of input.associatedQuestionnaire.interviewerInstructions){
            var iiFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
            var ii = xmlDoc.createElementNS(nsd, "d:InterviewerInstruction")
            ii.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + instruction.uuid + ":1.0.0"))
            ii.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            ii.appendChild(createTextNode(xmlDoc, nsr, "r:ID", instruction.uuid))
            ii.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            var instructionText = xmlDoc.createElementNS(nsd, "d:InstructionText")
            var literalText = xmlDoc.createElementNS(nsd, "d:LiteralText")
            literalText.appendChild(createTextNode(xmlDoc, nsd, "d:Text", instruction.instructionText))
            instructionText.appendChild(literalText)
            ii.appendChild(instructionText)
            iiFragment.appendChild(ii)
            fragmentInstance.appendChild(iiFragment)
        }
    }

    if(input.associatedQuestionnaire.respondentInstructions) {
        var risFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
        var ris = xmlDoc.createElementNS(nsd, "d:InterviewerInstructionScheme")
        ris.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + input.associatedQuestionnaire.respInstrSchemeUuid + ":1.0.0"))
        ris.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        ris.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.associatedQuestionnaire.respInstrSchemeUuid))
        ris.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        var label = xmlDoc.createElementNS(nsr, "r:Label")
        var labelContent = xmlDoc.createElementNS(nsr, "r:Content")
        labelContent.appendChild(createTextNode(xmlDoc, nsr, "r:Text", 'target audience - Respondent'))
        label.appendChild(labelContent)
        ris.appendChild(label)
        for(const instruction of input.associatedQuestionnaire.respondentInstructions){
            var instructionReference = xmlDoc.createElementNS(nsr, "r:InterviewerInstructionReference")
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", instruction.uuid))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "Instruction"))
            ris.appendChild(instructionReference)
        }
        risFragment.appendChild(ris)
        fragmentInstance.appendChild(risFragment)

        for(const instruction of input.associatedQuestionnaire.respondentInstructions){
            var riFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
            var ri = xmlDoc.createElementNS(nsd, "d:InterviewerInstruction")
            ri.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + instruction.uuid + ":1.0.0"))
            ri.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            ri.appendChild(createTextNode(xmlDoc, nsr, "r:ID", instruction.uuid))
            ri.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            var instructionText = xmlDoc.createElementNS(nsd, "d:InstructionText")
            var literalText = xmlDoc.createElementNS(nsd, "d:LiteralText")
            literalText.appendChild(createTextNode(xmlDoc, nsd, "d:Text", instruction.instructionText))
            instructionText.appendChild(literalText)
            ri.appendChild(instructionText)
            riFragment.appendChild(ri)
            fragmentInstance.appendChild(riFragment)
        }
    }

    if(input.associatedQuestionnaire.programmingInstructions) {
        var pisFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
        var pis = xmlDoc.createElementNS(nsd, "d:InterviewerInstructionScheme")
        pis.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + input.associatedQuestionnaire.progInstrSchemeUuid + ":1.0.0"))
        pis.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
        pis.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.associatedQuestionnaire.progInstrSchemeUuid))
        pis.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
        var label = xmlDoc.createElementNS(nsr, "r:Label")
        var labelContent = xmlDoc.createElementNS(nsr, "r:Content")
        labelContent.appendChild(createTextNode(xmlDoc, nsr, "r:Text", 'target audience - Programming'))
        label.appendChild(labelContent)
        pis.appendChild(label)
        for(const instruction of input.associatedQuestionnaire.programmingInstructions){
            var instructionReference = xmlDoc.createElementNS(nsr, "r:InterviewerInstructionReference")
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", instruction.uuid))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            instructionReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "Instruction"))
            pis.appendChild(instructionReference)
        }
        pisFragment.appendChild(pis)
        fragmentInstance.appendChild(pisFragment)

        for(const instruction of input.associatedQuestionnaire.programmingInstructions){
            var piFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
            var pi = xmlDoc.createElementNS(nsd, "d:InterviewerInstruction")
            pi.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + instruction.uuid + ":1.0.0"))
            pi.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
            pi.appendChild(createTextNode(xmlDoc, nsr, "r:ID", instruction.uuid))
            pi.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
            var instructionText = xmlDoc.createElementNS(nsd, "d:InstructionText")
            var literalText = xmlDoc.createElementNS(nsd, "d:LiteralText")
            literalText.appendChild(createTextNode(xmlDoc, nsd, "d:Text", instruction.instructionText))
            instructionText.appendChild(literalText)
            pi.appendChild(instructionText)
            piFragment.appendChild(pi)
            fragmentInstance.appendChild(piFragment)
        }
    }

    var prolog = '<?xml version="1.0" encoding="UTF-8"?>'
    var xmlString = new XMLSerializer().serializeToString(xmlDoc)
    return prolog + "\n" + formatXml(xmlString)
}