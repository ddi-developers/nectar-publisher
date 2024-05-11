/****
 * Calls opencpu to parse spss / sav etc

// Reading the SPSS file
curl https://cloud.opencpu.org/ocpu/library/haven/R/read_sav -F "file=@well_being.sav"

> Get ID for directory (IDREP)

// Getting attributes for each variable
curl https://cloud.opencpu.org/ocpu/library/base/R/lapply -d "X=IDREP&FUN=function(x) attributes(x)"

> GET ID for directory (IDREP2)

// Getting codeLists
curl https://cloud.opencpu.org/ocpu/library/base/R/lapply -d "X=IDREP&FUN=function(x) as.list(attributes(x)$labels)"

> GET ID for directory (IDREP3)

// Exporting results
curl https://cloud.opencpu.org/ocpu/tmp/IDREP2/R/.val/json
curl https://cloud.opencpu.org/ocpu/tmp/IDREP3/R/.val/json
 
 */
class OpenCPU{

    static async parseFile(file, doneCallback){
        var dataset = new Dataset()

        dataset.fileName = file.name
        dataset.mimeType = file.type
        dataset.fileSize = file.size
        dataset.lastModified = new Date(file.lastModified).toISOString()
        dataset.sha256 = await checksum(file, "SHA-256")
        dataset.columns = []
        dataset.delimiter = null
        dataset.linebreak = null

        var base = "https://cloud.opencpu.org/ocpu/";
        var data = new FormData()
        data.append('file', file)

        fetch(base + "library/haven/R/read_sav", {
            method: 'POST',
            body: data
        })
        .then(response => {
            // Check if the response is successful
            if (!response.ok) {
              throw new Error('Network response was not ok ID1');
            }
            // Read the response content as text
            return response.text();
        })
        .then(responseText => { 
            console.log("RESULT FROM: " + base + "library/haven/R/read_sav")
            var id1 = getId(responseText)

            console.log("ID1: " +id1)
            
            // Getting attributes for each variable
            // curl https://cloud.opencpu.org/ocpu/library/base/R/lapply -d "X=IDREP&FUN=function(x) attributes(x)"
            
            var data = new FormData()
            data.append('X', id1)
            data.append('FUN', "function(x) attributes(x)")

            fetch(base + "library/base/R/lapply", {
                method: 'POST',
                body: data
            })
            .then(response => {
                // Check if the response is successful
                if (!response.ok) {
                  throw new Error('Network response was not ok ID2');
                }
                // Read the response content as text
                return response.text();
            })
            .then(responseText => {
                var id2 = getId(responseText)
                console.log("ID2: " +id2)

                fetch(base +`/tmp/${id2}/R/.val/json`)
                .then(response => {
                    // Check if the response is successful (HTTP status code 200)
                    if (!response.ok) {
                      throw new Error('Network response was not ok for stats');
                    }
                    // Parse the response body as JSON
                    return response.json();
                })
                .then(json => {
    

                    // Getting codeLists
                    //curl https://cloud.opencpu.org/ocpu/library/base/R/lapply -d "X=IDREP&FUN=function(x) as.list(attributes(x)$labels)"
                    var data = new FormData()
                    data.append('X', id1)
                    data.append('FUN', "function(x) as.list(attributes(x)$labels)")
        
                    fetch(base + "library/base/R/lapply", {
                        method: 'POST',
                        body: data
                    }).then(response => {
                        // Check if the response is successful
                        if (!response.ok) {
                          throw new Error('Network response was not ok ID3');
                        }
                        // Read the response content as text
                        return response.text();
                    })
                    .then(responseText => {
                        var id3 = getId(responseText)
                        console.log("ID3: "+id3)
                        fetch(base +`/tmp/${id3}/R/.val/json`)
                        .then(response => {
                            // Check if the response is successful (HTTP status code 200)
                            if (!response.ok) {
                              throw new Error('Network response was not ok for codelist');
                            }
                            // Parse the response body as JSON
                            return response.json();
                        })
                        .then(codeLists => {
                            console.log(json)
                            console.log(codeLists)
                            var i = 0
                            for (const [key, value] of Object.entries(json)) {
                                console.log(`${key}: ${value}`)
                                var column = new DatasetColumn(key)
                                if(value.label){
                                    column.label = value.label[0]
                                }
        
                                if(value.class){
                                    if(value.class[0] == "haven_labelled"){
                                        column.hasIntendedDataType = "code"
                                        if(codeLists[key]){
                                            for(const [k,v] of Object.entries(codeLists[key])){
                                                var c = new CodeValue()
                                                c.value = v[0]
                                                c.label = k
                                                column.codeValues.push(c)
                                            }
                                        }
                                    }else{
                                        column.hasIntendedDataType = getVarIntendedDataType(value.class.slice(-1)[0])
                                    }
                                    column.varFormat.schema = "R"
                                    column.varFormat.type = value.class.slice(-1)[0]
                                    column.varFormat.otherCategory = getVarDataType(value.class.slice(-1)[0])
                                }
        
                                column.position = i
                                dataset.columns.push(column)
                                i = i + 1
                            }
                            console.log(dataset)
                            doneCallback(dataset)
        


                        })
                    })
                    

                })
            })
        })
    }
}

function getId(responseText){
    var lines = responseText.split("\n")

    var regex = /\/ocpu\/tmp\/(.*?)\/R\/\.val/
    return regex.exec(lines[0])[1]
}

function getVarIntendedDataType(type){
    switch(type){
        case 'double':
        case 'complex':
        case 'integer':
            return 'numeric';
            break;
        case 'character':
            return 'text';
            break;
    }
    
    return 'other';
}


function getVarDataType(type){
    switch(type){
        case 'double':
            return 'Double';
            break;
        //case 'complex':
        case 'integer':
            return 'Integer';
            break;
        case 'character':
            return 'String';
            break;
        case 'logical':
            return 'Boolean';
            break;
    }
    
    return 'Other';
}