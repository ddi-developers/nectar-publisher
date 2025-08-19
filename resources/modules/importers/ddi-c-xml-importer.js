
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
    var var_dictionary = {};

    var parser = new DOMParser();
    var doc = parser.parseFromString(ddiCString, "application/xml");

    var vars = doc.getElementsByTagName('var');
    
    for (var i = 0; i < vars.length; i++) {
        var gChild = vars[i];
        var var_labl ='';
        var var_dscr ='';

        var ggChildren = gChild.children;
        for (var j = 0; j < ggChildren.length; j++) {
            if (ggChildren[j].nodeName === 'labl'){
                var_labl = ggChildren[j].textContent.trim();
            } else if (ggChildren[j].nodeName === 'txt'){
                var_dscr = ggChildren[j].textContent.trim();
            }
        }
        var_dictionary[gChild.getAttribute("name").trim()] = [
            var_labl, 
            var_dscr, 
            gChild.getAttribute("representationType")
        ]
    }

    return var_dictionary;
}

export {
    importDdiCMetadata,
    readDDiCString
};