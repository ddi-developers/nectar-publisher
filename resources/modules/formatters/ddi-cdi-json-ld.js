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

function toDdiCdiJsonLd(input){
    var cdi = {
        '@context': "https://docs.ddialliance.org/DDI-CDI/1.0/model/encoding/json-ld/ddi-cdi.jsonld",
        'DDICDIModels':[]
    }

    if(input.columns.filter(c => c.coded).length > 0){
        cdi['@context'] = [cdi['@context'], {"skos": "http://www.w3.org/2004/02/skos/core#"}]
    }
    var dataStore= {
        '@id' : '#dataStore',
        '@type' : 'DataStore',
        'has_LogicalRecord' : []
    }
    dataStore['has_LogicalRecord'].push('#logicalRecord')

    var physicalSegmentLayout = {
        '@id' : "#physicalSegmentLayout-" + input.uuid,
        '@type': "PhysicalSegmentLayout",
        'formats' : '#logicalRecord',
        'isDelimited' : 'true',
        'isFixedWidth' : false,
        'delimiter' : input.delimiter,
        'has_ValueMapping' : [],
        'has_ValueMappingPosition' : []
    }

    var logicalRecord = {
        '@id' : "#logicalRecord",
        '@type': "LogicalRecord",
        'organizes': "#wideDataSet",
        'has_InstanceVariable' : []
    }

    var wideDataSet = {
        '@id' : "#wideDataSet",
        '@type': "WideDataSet",
        "isStructuredBy": "#wideDataStructure"
    }

    var wideDataStructure = {
        '@id' : "#wideDataStructure",
        '@type': "WideDataStructure",
        'has_DataStructureComponent' : []
    }
    
    var components = []
    var valueMappings = []
    var valueMappingPositions = []
    var instanceVariables = []
    var substantiveValueDomains = []

    column_index = 0
    for(const c of input.columns){
        logicalRecord['has_InstanceVariable'].push('#instanceVariable-' + c.name)

        var instanceVariable = {
            '@id' : '#instanceVariable-' + c.name,
            '@type' : 'InstanceVariable',
            'physicalDataType' : {
                '@type' : 'ControlledVocabularyEntry',
                'entryValue' : c.hasIntendedDataType.type
            },
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
            'has_PhysicalSegmentLayout': "#physicalSegmentLayout-" + input.uuid,
            'has_ValueMapping': [],
            'takesSubstantiveValuesFrom_SubstantiveValueDomain': '#substantiveValueDomain-' + c.name
        } 
        instanceVariable['has_ValueMapping'].push('#valueMapping-' + c.name)
        instanceVariables.push(instanceVariable)

        var entryValue = ""
        if (c.coded){
            entryValue = '#conceptScheme-' + c.name
        } else if (c.hasIntendedDataType.type == 'numeric' || c.hasIntendedDataType.type == 'decimal'){
            entryValue = 'https://www.w3.org/TR/xmlschema-2/#decimal'
        } else if (c.hasIntendedDataType.type == 'datetime'){
            entryValue = 'https://www.w3.org/TR/xmlschema-2/#dateTime'
        } else {
            entryValue = 'https://www.w3.org/TR/xmlschema-2/#string'
        }

        substantiveValueDomains.push({
            '@id' : '#substantiveValueDomain-' + c.name,
            '@type' : 'SubstantiveValueDomain',
            'recommendedDataType': {
                '@type' : "ControlledVocabularyEntry",
                'entryValue' : entryValue
            }
        })
        
        valueMappings.push({
            '@id' : '#valueMapping-' + c.name,
            '@type' : 'ValueMapping',
            'defaultValue' : ''
        })
        physicalSegmentLayout['has_ValueMapping'].push('#valueMapping-' + c.name)

        valueMappingPositions.push({
            '@id' : '#valueMappingPosition-' + c.name,
            '@type' : 'ValueMappingPosition',
            'value' : column_index,
            'indexes' : ['#valueMapping-' + c.name]
        })
        physicalSegmentLayout['has_ValueMappingPosition'].push('#valueMappingPosition-' + c.name)

        if(c.role == 'Identifier'){
            var id = "#identifierComponent-" + c.name
            components.push({
                '@id' : id,
                '@type' : 'IdentifierComponent',
                'isDefinedBy_RepresentedVariable' : '#instanceVariable-' + c.name
            })
            wideDataStructure['has_DataStructureComponent'].push(id)
        }
        if(c.role == 'Attribute'){
            var id = "#attributeComponent-" + c.name
            components.push({
                '@id' : id,
                '@type' : 'AttributeComponent',
                'isDefinedBy_RepresentedVariable' : '#instanceVariable-' + c.name
            })
            wideDataStructure['has_DataStructureComponent'].push(id)
        }
        if(c.role == 'Measure'){
            var id = "#measureComponent-" + c.name
            components.push({
                '@id' : id,
                '@type' : 'MeasureComponent',
                'isDefinedBy_RepresentedVariable' : '#instanceVariable-' + c.name
            })
            wideDataStructure['has_DataStructureComponent'].push(id)
        } 

        column_index += 1
    }

    cdi['DDICDIModels'] = cdi['DDICDIModels'].concat(logicalRecord)

    cdi['DDICDIModels'] = cdi['DDICDIModels'].concat(physicalSegmentLayout)
    cdi['DDICDIModels'] = cdi['DDICDIModels'].concat(valueMappings)
    cdi['DDICDIModels'] = cdi['DDICDIModels'].concat(valueMappingPositions)
    cdi['DDICDIModels'] = cdi['DDICDIModels'].concat(dataStore)

    cdi['DDICDIModels'] = cdi['DDICDIModels'].concat(wideDataSet)
    cdi['DDICDIModels'] = cdi['DDICDIModels'].concat(wideDataStructure)  
    cdi['DDICDIModels'] = cdi['DDICDIModels'].concat(components)
    cdi['DDICDIModels'] = cdi['DDICDIModels'].concat(instanceVariables)
    cdi['DDICDIModels'] = cdi['DDICDIModels'].concat(substantiveValueDomains)

    for(const c of input.columns){
        if(c.coded){
            cdi['DDICDIModels'] = cdi['DDICDIModels'].concat(c.getConceptScheme())
            cdi['DDICDIModels'] = cdi['DDICDIModels'].concat(c.getConcepts())
        }
    }

    return JSON.stringify(cdi, null, 2)
}