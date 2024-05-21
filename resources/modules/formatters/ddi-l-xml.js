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

	var topLevelReference = xmlDoc.createElementNS(nsddi, "ddi:TopLevelReference")
	topLevelReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	topLevelReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.fileName + "-su"))
	topLevelReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	topLevelReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "StudyUnit"))
	fragmentInstance.appendChild(topLevelReference)
			
	var studyUnitFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
	var studyUnit = xmlDoc.createElementNS(nspi, "s:StudyUnit")
	studyUnit.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + input.fileName + "-su:1.0.0"))
	studyUnit.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	studyUnit.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.fileName + "-su"))
	studyUnit.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	var physicalInstanceReference = xmlDoc.createElementNS(nsr, "r:PhysicalInstanceReference")
	physicalInstanceReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	physicalInstanceReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.fileName + "-pi"))
	physicalInstanceReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	physicalInstanceReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "PhysicalInstance"))
	studyUnit.appendChild(physicalInstanceReference)
	var logicalProductReference = xmlDoc.createElementNS(nsr, "r:LogicalProductReference")
	logicalProductReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	logicalProductReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.fileName + "-lp"))
	logicalProductReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	logicalProductReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "LogicalProduct"))
	studyUnit.appendChild(logicalProductReference)
	studyUnitFragment.appendChild(studyUnit)
	fragmentInstance.appendChild(studyUnitFragment)

	var physicalInstanceFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
	var physicalInstance = xmlDoc.createElementNS(nspi, "pi:PhysicalInstance")
	physicalInstance.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + input.fileName + "-pi:1.0.0"))
	physicalInstance.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	physicalInstance.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.fileName + "-pi"))
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
	logicalProduct.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + input.fileName + "-lp:1.0.0"))
	logicalProduct.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	logicalProduct.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.fileName + "-lp"))
	logicalProduct.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	var variableSchemeReference = xmlDoc.createElementNS(nsr, "r:VariableSchemeReference")
	variableSchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	variableSchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.fileName + "-vs"))
	variableSchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	variableSchemeReference.appendChild(createTextNode(xmlDoc, nsr, "r:TypeOfObject", "VariableScheme"))
	logicalProduct.appendChild(variableSchemeReference)
	logicalProductFragment.appendChild(logicalProduct)
	fragmentInstance.appendChild(logicalProductFragment)

	var variableSchemeFragment = xmlDoc.createElementNS(nsddi, "ddi:Fragment")
	var variableScheme = xmlDoc.createElementNS(nspi, "l:VariableScheme")
	variableScheme.appendChild(createTextNode(xmlDoc, nsr, "r:URN", "urn:ddi:int.example:" + input.fileName + "-vs:1.0.0"))
	variableScheme.appendChild(createTextNode(xmlDoc, nsr, "r:Agency", agency))
	variableScheme.appendChild(createTextNode(xmlDoc, nsr, "r:ID", input.fileName + "-vs"))
	variableScheme.appendChild(createTextNode(xmlDoc, nsr, "r:Version", "1.0.0"))
	variableSchemeFragment.appendChild(variableScheme)
	fragmentInstance.appendChild(variableSchemeFragment)

    var prolog = '<?xml version="1.0" encoding="UTF-8"?>'
    var xmlString = new XMLSerializer().serializeToString(xmlDoc)
    return prolog + "\n" + formatXml(xmlString)
}