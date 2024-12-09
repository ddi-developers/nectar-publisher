/**
 * @param {string} refType
 * @param {string} refId
 * @param {string} type
 * @returns {Object}
 */
function createBaseRef(refType, refId, type = "ref") {
    const ref = {};
    ref.$type = type;
    ref.value = [refType, refId];
    return ref;
}

/**
 * @param {string} type
 * @param {string} uuid
 * @param {string} agency
 * @param {string} version
 * @returns {Object}
 */
function createRef(type = "ref", uuid = window.crypto.randomUUID(), agency = "int.example", version = "1") {
    const ref = {};
    ref.$type = type;
    ref.URN = `urn:ddi:${agency}:${uuid}:${version}`;
    ref.Agency = agency;
    ref.ID = uuid;
    ref.Version = version;
    return ref;
}

/**
 * @param {string} value
 * @param {string} languageTag
 * @returns {Object}
 */
function createMultilingualStringValue(value, languageTag = "en") {
    return {
        MultilingualStringValue: {
            Value: value,
            LanguageTag: languageTag
        }
    }
}   

/**
 * @param {Object} input
 * @returns {string}
 */
function toDdi40LJson(input) {
    const ddi = {};
    console.log(input);

    /**
     * PhysicalInstance
     */
    const physicalInstance = createRef("PhysicalInstance", input.uuid);
    physicalInstance.DataFingerprint = [];
    physicalInstance.DataFingerprint.push({
        AlgorithmSpecification: "SHA-256",
        DataFingerprintValue: input.sha256
    });
    physicalInstance.DataFileIdentification = [];
    physicalInstance.DataFileIdentification.push({
        DataFileURI: "file:///" + input.fileName,
        SizeInBytes: input.fileSize
    });

    ddi.topLevelReference = [];
    ddi.topLevelReference.push(createBaseRef("PhysicalInstance", physicalInstance.URN));

    /**
     * DataRelationship
     */
    const dataRelationshipReference = createRef("DataRelationship");
    ddi.PhysicalInstance = {};
    ddi.PhysicalInstance[physicalInstance.URN] = physicalInstance;
    physicalInstance.DataRelationshipReference = [];
    physicalInstance.DataRelationshipReference.push(createBaseRef("DataRelationship", dataRelationshipReference.URN));

    /**
     * LogicalRecord
     */
    const logicalRecord = createRef("LogicalRecordType");
    ddi.DataRelationship = {};
    ddi.DataRelationship[dataRelationshipReference.URN] = dataRelationshipReference;
    dataRelationshipReference.LogicalRecord = [];
    dataRelationshipReference.LogicalRecord.push(logicalRecord);

    /**
     * VariablesInRecord
     */
    logicalRecord.VariablesInRecord = {};
    logicalRecord.VariablesInRecord.VariableUsedReference = [];

    ddi.Variable = {};
    const processedVariables = new Set();

    for(const column of input.columns) {
        if (!processedVariables.has(column.uuid)) {
            processedVariables.add(column.uuid);
            
            const variableReference = createRef("Variable", column.uuid);
            variableReference.VariableName = [];
            variableReference.VariableName.push({
                String: [ createMultilingualStringValue(column.name) ]
            });
            if(column.label) {
                variableReference.Label = [];
                variableReference.Label.push({
                    Content: [ createMultilingualStringValue(column.label) ]
                });
            }
            if(column.description) {
                variableReference.Description = {
                    Content: [ createMultilingualStringValue(column.description) ]
                }
            }

            variableReference.VariableRepresentation = {};
            if(column.coded) {
                const codeRepresentation = {};
                codeRepresentation.RecommendedDataType = column.hasIntendedDataType.id;

                const codeListReference = createRef("CodeListReference", column.codeListUuid);
                codeRepresentation.CodeListReference = codeListReference;
                codeListReference.TypeOfObject = "CodeList";

                variableReference.VariableRepresentation.CodeRepresentation = codeRepresentation;
            }
            else if(column.hasIntendedDataType.type == 'numeric' || column.hasIntendedDataType.type == 'decimal' || column.hasIntendedDataType.type == 'boolean') {
                const numericRepresentation = {};
                numericRepresentation.NumericTypeCode = column.hasIntendedDataType.id;
                variableReference.NumericRepresentation = numericRepresentation;
            }
            else if(column.hasIntendedDataType.type == 'string') {
                const textRepresentation = {};
                textRepresentation.RecommendedDataType = column.hasIntendedDataType.id;
                variableReference.TextRepresentation = textRepresentation;
            }
            else if(column.hasIntendedDataType.type == 'datetime') {
                const datetimeRepresentation = {};
                datetimeRepresentation.RecommendedDataType = column.hasIntendedDataType.id;
                variableReference.DateTimeRepresentation = datetimeRepresentation;
            }

            ddi.Variable[variableReference.URN] = variableReference;
        }
        
        logicalRecord.VariablesInRecord.VariableUsedReference.push(
            createBaseRef("Variable", `urn:ddi:${column.agency || 'int.example'}:${column.uuid}:${column.version || '1'}`)
        );
    }

    return JSON.stringify(ddi, null, 2);
}
