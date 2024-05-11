
function importDdiCMetadata(file, columns){
    // console.log("in the function importMetadata()")
    // console.log(file)

    var_dictionary= {};

    var reader = new FileReader();
    reader.onload = function(e) {
        readXml=e.target.result;
        var parser = new DOMParser();
        var doc = parser.parseFromString(readXml, "application/xml");

        for (const child of doc.documentElement.children) {
            if(child.nodeName === 'dataDscr') {
                //console.log(child);
                var gChildren = child.children;
                for (var i = 0; i < gChildren.length; i++) {
                    if (gChildren[i].nodeName === 'var'){
                        gChild = gChildren[i];
                    
                        var_labl ='';
                        var_dscr ='';
                        var ggChildren = gChild.children;
                        for (var j = 0; j < ggChildren.length; j++) {
                            if (ggChildren[j].nodeName === 'labl'){
                                var_labl = ggChildren[j].textContent.trim();
                            } else if (ggChildren[j].nodeName === 'txt'){
                                var_dscr = ggChildren[j].textContent.trim();
                            }
                        }
                        var_dictionary[gChild.getAttribute("name").trim()] = [var_labl, var_dscr, gChild.getAttribute("representationType")]
                    }
                }
            }
        }

        //console.log(var_dictionary);

        columns.forEach(item => {
            var_values = var_dictionary[item.name];
            item.label = var_values[0];
            item.description = var_values[1];
            if (var_values[2] !== null) item.hasIntendedDataType = var_values[1];
        });
    }
    reader.readAsText(file);

    columns.forEach(item => {
        console.log(item)
    });

    return columns;
}