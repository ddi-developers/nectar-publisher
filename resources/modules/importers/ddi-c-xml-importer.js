import { DatasetColumn } from '../../models/DatasetColumn.ts';
import { CodeValue } from '../../models/CodeValue.ts';

function importDdiCMetadata(file, columns){
    var_dictionary = {};

    var reader = new FileReader();

    reader.onload = function(e) {
        readXml = e.target.result;
        var_dictionary = readDDiCString(readXml);
        console.debug('DDI-C metadata read:', var_dictionary);
    }
    reader.readAsText(file);

    return columns;
}

function readDDiCString(ddiCString){
    var variables = [];

    var parser = new DOMParser();
    var doc = parser.parseFromString(ddiCString, "application/xml");

    var vars = doc.getElementsByTagName('var');
    
    for (var i = 0; i < vars.length; i++) {
        var id = vars[i].getAttribute("name").trim();

        var variableLabel = '';
        var variableDescription = '';
        
        var variable = new DatasetColumn(id);

        for (var j = 0; j < vars[i].children.length; j++) {
            switch(vars[i].children[j].nodeName) {
                case 'labl':
                    variableLabel = vars[i].children[j].textContent.trim();
                    break;
                case 'txt':
                    variableDescription = vars[i].children[j].textContent.trim();
                    break;
                case 'catgry':
                    var categoryLabel = vars[i].children[j].getElementsByTagName('labl')[0].textContent.trim();
                    var categoryValue = vars[i].children[j].getElementsByTagName('catValu')[0].textContent.trim();
                    var catStat = vars[i].children[j].getElementsByTagName('catStat')[0];
                    var codeValue = new CodeValue(categoryValue, categoryLabel);
                    codeValue.frequency = catStat ? catStat.textContent.trim() : null;
                    variable.codeValues.push(codeValue);
                    variable.coded = true;
                    
                    break;
            }
        }

        variable.label = variableLabel;
        variable.description = variableDescription;
        variable.hasIntendedDataType = {id: "Int", label: "Int", type: "numeric" };
        variables.push(variable);
    }

    return variables;
}

export {
    importDdiCMetadata,
    readDDiCString
};