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

    static getFileInfo(file){
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
                    console.log(json)
                    for (const [key, value] of Object.entries(json)) {
                        console.log(`${key}: ${value}`);
                    }
                      

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