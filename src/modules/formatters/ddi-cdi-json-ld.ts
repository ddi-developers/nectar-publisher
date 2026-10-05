/*
TODOS:
    FROM: pierre-antoine@w3.org

    On 28/09/2023 23:51, Pierre-Antoine Champin wrote:

    * all CDI properties that expect an object (as opposed to a simple string) 
      will recognize strings as being IRIs, so no need to wrap them in
     { "@id": ... }, including in lists

    A few more comments on your file :

    * your data does not pass the SHACL validator -- 
      some errors are glitches which should be fixed in the model / shape / json-ld context soon,
      but the following seem to be relevant

        Violation 1 "Property may only have 1 value, but found 7" (cdi:DataStructure_has_PrimaryKey  of #datastructure) 
        Violation 1 "Property needs to have at least 1 values, but found 0" (cdi:wideDataset_has_DataPoint of #wideDataset)
        Violation 1 "Property needs to have at least 1 values, but found 0" (cdi:DataStore-allowsDuplicates of #dataStore)
        Violation 1 "Property needs to have at least 1 values, but found 0" (cdi:PhysicalwideDataset-allowsDuplicates of #physicalwideDataset)

    * regaring the 2nd violation above, I believe that Flavio told me today that he was considering relaxing this constraint, 
      so it is probably moot (but you should check with him)

    * regarding the 1st violation above, 
      I'm assuming that maybe you consider the list of 7 element to be one primary key, 
      but that's not how it should be modelled 
      (as such, it says that each of the 7 component is a key on its owb).

        should probably be
        "@id": "#datastructure",
        "@type": "DimensionalDataStructure",
        "has": {
            "@type": "PrimaryKey",
            "isComposedOf": [
                { "correspondsTo": "#dimensionComponent-Offense", "@type": "PrimaryKeyComponent" },
                { "correspondsTo": "#dimensionComponent-Year", "@type": "PrimaryKeyComponent" },
                { "correspondsTo": "#dimensionComponent-Geography", "@type": "PrimaryKeyComponent" },
                { "correspondsTo": "#measureComponent-TotalNumber_of_Cases", "@type": "PrimaryKeyComponent" }
            ]
        }
        

    Note that I also removed the ComponentPosition's from the description of the primary key, because this does not seem to fit in the model, 
    and seemed redundant with the DimensionComponent's that are already there. 
    You may want to adapt it if I am wrong.

    another tip about the JSON-LD context :

    you can use "iri" instead of "@id", and "type" instead of "@type" (the context contains the appropriate aliases).
    The @-keyword are sometimes frowned upon by JSON developers (as you can't use them as simple attribute).

    best
*/

import type { Dataset } from "../../models/Dataset"

export function toDdiCdiJsonLd(input: Dataset){
    const dataStore = {
        '@id' : '#dataStore',
        '@type' : 'DataStore',
        'allowsDuplicates' : false,
        'has_LogicalRecord' : ['#logicalRecord']
    }
    
    const physicalDataset = {
        '@id' : "#physicalDataset-" + input.uuid,
        '@type': "PhysicalDataset",
        'allowsDuplicates' : false,
        'physicalFileName' : input.fileName,
        'correspondsTo_DataSet' : "#wideDataset-" + input.uuid,
        'formats' : '#dataStore',
        'has_PhysicalRecordSegment' : ["#physicalRecordSegment"]
    }
    
    const physicalSegmentLayout = {
        '@id' : "#physicalSegmentLayout",
        '@type': "PhysicalSegmentLayout",
        'formats' : '#logicalRecord',
        'allowsDuplicates': false,
        'isDelimited' : 'true',
        'isFixedWidth' : false,
        'delimiter' : input.delimiter,
        'has_ValueMappingPosition' : [] as string[]
    }

    const physicalRecordSegment = {
        '@id' : "#physicalRecordSegment",
        '@type': "PhysicalRecordSegment",
        'mapsTo' : '#logicalRecord',
        'allowsDuplicates' : false,
        'has_PhysicalSegmentLayout': '#physicalSegmentLayout',
        'has_DataPointPosition' : [] as string[]
    }

    const logicalRecord = {
        '@id' : "#logicalRecord",
        '@type': "LogicalRecord",
        'organizes': "#wideDataset",
        has_InstanceVariable : [] as (string | Record<string, string>)[]
    }

    const wideDataset = {
        '@id' : "#wideDataset-" + input.uuid,
        '@type': "WideDataset",
        "isStructuredBy": "#wideDataStructure"
    }

    const wideDataStructure = {
        '@id' : "#wideDataStructure",
        '@type': "WideDataStructure",
        'has_DataStructureComponent' : [] as string[]
    }

    const components = []
    const valueMappings = []
    const instanceVariables = []
    const substantiveValueDomains = []

    for(const c of input.columns){
        logicalRecord.has_InstanceVariable.push('#instanceVariable-' + c.uuid)

        const physicalDataType = c.hasIntendedDataType ? {
            '@type' : 'ControlledVocabularyEntry',
            'entryValue' : c.hasIntendedDataType.type
        } : undefined;

        const instanceVariable = {
            '@id' : '#instanceVariable-' + c.uuid,
            '@type' : 'InstanceVariable',
            'physicalDataType' : physicalDataType,
            'name' : {
                "@type": "ObjectName",
                "name": c.id
            }, 
            "displayLabel": {
                "@type": "LabelForDisplay",
                "locationVariant": {
                    "@type": "ControlledVocabularyEntry",
                    "entryValue": c.label
                }
            },
            'has_PhysicalSegmentLayout': "#physicalSegmentLayout",
            takesSubstantiveValuesFrom_SubstantiveValueDomain: undefined as string | undefined
        } 

        if (c.coded){
            instanceVariable.takesSubstantiveValuesFrom_SubstantiveValueDomain = '#substantiveValueDomain-' + c.uuid

            const substantiveValueDomain = {
                '@id' : '#substantiveValueDomain-' + c.uuid,
                '@type' : 'SubstantiveValueDomain',
                'recommendedDataType': {
                    '@type' : "ControlledVocabularyEntry",
                    'entryValue' : 'ConceptScheme-' + c.uuid
                }
            }
            substantiveValueDomains.push(substantiveValueDomain)

            // {
            //     "@id": "#substantiveValueDomain-cntry",
            //     "@type": "SubstantiveValueDomain",
            //     "recommendedDataType": {
            //         "@type": "ControlledVocabularyEntry",
            //         "entryValue": "https://www.w3.org/TR/xmlschema-2/#string"
            //     },
            //     "isDescribedBy": "#substantiveValueAndConceptDescription-cntry",
            //     "takesValuesFrom": "#substantiveEnumerationDomain-cntry"
            // },
        }
        instanceVariables.push(instanceVariable)

        valueMappings.push({
            '@id' : '#valueMapping-' + c.uuid,
            '@type' : 'ValueMapping',
            'defaultValue' : '',
            'formats' : ['#instanceVariable-' + c.uuid]
        })

        physicalSegmentLayout['has_ValueMappingPosition'].push('#valueMapping-' + c.uuid)
        if(c.role == 'Identifier'){
            const id = "#identifierComponent-" + c.uuid
            components.push({
                '@id' : id,
                '@type' : 'IdentifierComponent',
                'isDefinedBy' : '#instanceVariable-' + c.uuid
            })
            wideDataStructure['has_DataStructureComponent'].push(id)
        }
        if(c.role == 'Attribute'){
            const id = "#attributeComponent-" + c.uuid
            components.push({
                '@id' : id,
                '@type' : 'AttributeComponent',
                'isDefinedBy' : '#' + c.uuid
            })
            wideDataStructure['has_DataStructureComponent'].push(id)
        }
        if(c.role == 'Measure'){
            const id = "#measureComponent-" + c.uuid
            components.push({
                '@id' : id,
                '@type' : 'MeasureComponent',
                'isDefinedBy' : '#' + c.uuid
            })
            wideDataStructure['has_DataStructureComponent'].push(id)
        }     
    }


    const anyCoded = Boolean(input.columns.find(c => c.coded));
      
    const cdi = {
        '@context': anyCoded ? ["https://ddi-alliance.bitbucket.io/DDI-CDI/DDI-CDI_v1.0-rc1/encoding/json-ld/ddi-cdi.jsonld", {"skos": "http://www.w3.org/2004/02/skos/core#"}] : "https://ddi-alliance.bitbucket.io/DDI-CDI/DDI-CDI_v1.0-rc1/encoding/json-ld/ddi-cdi.jsonld",
        DDICDIModels: [
            logicalRecord,
            physicalSegmentLayout,
            physicalRecordSegment,
            valueMappings,
            physicalDataset,
            dataStore,
            wideDataset,

            wideDataStructure,
            components,
            instanceVariables,
            substantiveValueDomains
        ]
    }

    for(const c of input.columns){
        //TODO: create concept scheme, connect it to the variable
        if(c.coded){
            cdi.DDICDIModels.push(c.getConceptScheme() as any);
            cdi.DDICDIModels.push(c.codeValues as any);
        }
    }

    return JSON.stringify(cdi, null, 2)
}
