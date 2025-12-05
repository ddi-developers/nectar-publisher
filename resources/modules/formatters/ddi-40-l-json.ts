import type { Dataset } from "../../models/Dataset";

function createBaseRef(refType: string, refId: string, type = "ref") {
    return {
        $type: type,
        value: [refType, refId]
    };
}

function createRef(type = "ref", id: string = window.crypto.randomUUID(), agency = "int.example", version = "1"): any {
    return {
        $type: type,
        URN: `urn:ddi:${agency}:${id}:${version}`,
        Agency: agency,
        ID: id,
        version: version
    };
}

function createMultilingualStringValue(value: string, languageTag = "en") {
    return {
        MultilingualStringValue: {
            Value: value,
            LanguageTag: languageTag
        }
    }
}   

export function toDdi40LJson(input: Dataset) {
    const ddi = {} as any;

    /**
     * PhysicalInstance
     */
    ddi.PhysicalInstance = {};
    const physicalInstance = createRef("PhysicalInstance", input.uuid);
    physicalInstance.DataFingerprint = {
        AlgorithmSpecification: "SHA-256",
        DataFingerprintValue: input.sha256
    };
    physicalInstance.DataFileIdentification = {
        DataFileURI: input.fileName ? "file:///" + input.fileName : undefined,
        SizeInBytes: input.fileSize
    };
    ddi.PhysicalInstance[physicalInstance.URN] = physicalInstance;

    ddi.topLevelReference = [createBaseRef("PhysicalInstance", physicalInstance.URN)];

    /**
     * DataRelationship
     */
    ddi.DataRelationship = {};
    const dataRelationshipReference = createRef("DataRelationship");
    physicalInstance.DataRelationshipReference = [createBaseRef("DataRelationship", dataRelationshipReference.URN)];

    /**
     * LogicalRecord
     */
    const logicalRecord = createRef("LogicalRecordType");
    ddi.DataRelationship[dataRelationshipReference.URN] = dataRelationshipReference;
    dataRelationshipReference.LogicalRecord = [logicalRecord];

    /**
     * VariablesInRecord
     */
    logicalRecord.VariablesInRecord = {};
    logicalRecord.VariablesInRecord.VariableUsedReference = [];

    ddi.Variable = {};
    const processedVariables = new Set();

    for (const column of input.columns) {
        if (!processedVariables.has(column.uuid)) {
            processedVariables.add(column.uuid);

            const variableReference = createRef("Variable", column.uuid);
            variableReference.VariableName = [];
            variableReference.VariableName.push({
                String: [createMultilingualStringValue(column.name)]
            });
            if (column.label) {
                variableReference.Label = [];
                variableReference.Label.push({
                    Content: [createMultilingualStringValue(column.label)]
                });
            }
            if (column.description) {
                variableReference.Description = {
                    Content: [createMultilingualStringValue(column.description)]
                }
            }

            variableReference.VariableRepresentation = {};
            if (column.coded) {
                const codeRepresentation = {
                    RecommendedDataType: column.hasIntendedDataType?.id,
                    CodeListReference: createRef("CodeListReference", column.codeListUuid),
                    TypeOfObject: "CodeList"
                };
                variableReference.VariableRepresentation.CodeRepresentation = codeRepresentation;
            }
            else {
                if (column.hasIntendedDataType) {
                    if (column.hasIntendedDataType.type == 'numeric' || column.hasIntendedDataType.type == 'decimal' || column.hasIntendedDataType.type == 'boolean') {
                        variableReference.NumericRepresentation = {
                            NumericTypeCode: column.hasIntendedDataType.id,
                        };;
                    }
                    else if (column.hasIntendedDataType.type == 'string') {
                        variableReference.TextRepresentation = {
                            RecommendedDataType: column.hasIntendedDataType.id
                        };
                    }
                    else if (column.hasIntendedDataType.type == 'datetime') {
                        variableReference.DateTimeRepresentation = {
                            RecommendedDataType: column.hasIntendedDataType.id
                        };
                    }
                }
            }

            ddi.Variable[variableReference.URN] = variableReference;
        }
        
        logicalRecord.VariablesInRecord.VariableUsedReference.push(
            createBaseRef("Variable", `urn:ddi:${column.agency || 'int.example'}:${column.uuid}:${column.version || '1'}`)
        );
    }

    return JSON.stringify(ddi, null, 2);
}
