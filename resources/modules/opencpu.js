/****
 * Calls opencpu to parse spss / sav etc

// Reading the SPSS file
curl https://cloud.opencpu.org/ocpu/library/haven/R/read_sav -F "file=@well_being.sav"

> Get ID for directory (IDREP)

// Getting attributes for each variable
curl https://cloud.opencpu.org/ocpu/library/base/R/lapply -d "X=IDREP&FUN=function(x) attributes(x)"

// Getting csv from file
curl https://cloud.opencpu.org/ocpu/library/utils/R/write.csv -d "x=x0b8bd45a2e949b&file='test.csv'"
curl https://cloud.opencpu.org/ocpu/tmp/x0b17a01642b5cd/files/test.csv    


> GET ID for directory (IDREP2)

// Getting codeLists
curl https://cloud.opencpu.org/ocpu/library/base/R/lapply -d "X=IDREP&FUN=function(x) as.list(attributes(x)$labels)"

> GET ID for directory (IDREP3)

// Exporting results
curl https://cloud.opencpu.org/ocpu/tmp/IDREP2/R/.val/json
curl https://cloud.opencpu.org/ocpu/tmp/IDREP3/R/.val/json
 


 */
class OpenCPU {
    static BASE_URL = "https://cloud.opencpu.org/ocpu/";

    static async parseFile(file, doneCallback) {
        var dataset = new Dataset();
        dataset.fileName = file.name;
        dataset.mimeType = file.type;
        dataset.fileSize = file.size;
        dataset.lastModified = new Date(file.lastModified).toISOString();
        dataset.sha256 = await checksum(file, "SHA-256");
        dataset.columns = [];
        dataset.delimiter = null;
        dataset.linebreak = null;

        try {
            const id1 = await OpenCPU.readSavFile(file);
            const id2 = await OpenCPU.getAttributes(id1);
            const json = await OpenCPU.getJson(id2);
            const id3 = await OpenCPU.getCodeLists(id1);
            const codeLists = await OpenCPU.getJson(id3);

            let i = 0;
            for (const [key, value] of Object.entries(json)) {
                const column = new DatasetColumn(key);
                if (value.label) column.label = value.label[0];
                column.hasIntendedDataType = RepresentationTypes[0];
                if (value.class) {
                    if (value.class[0] === "haven_labelled") {
                        column.coded = true;
                        if (codeLists[key]) {
                            for (const [k, v] of Object.entries(codeLists[key])) {
                                const c = new CodeValue();
                                c.value = v[0];
                                c.label = k;
                                column.codeValues.push(c);
                            }
                        }
                    }
                    column.varFormat.schema = "R";
                    column.varFormat.type = value.class.slice(-1)[0];
                    column.varFormat.otherCategory = getVarDataType(value.class.slice(-1)[0]);
                }
                column.position = i++;
                dataset.columns.push(column);
            }

            const id4 = await OpenCPU.writeCsv(id1);
            const csvContent = await OpenCPU.getCsv(id4);

            Parser.parseDelimtedTextString(csvContent, dataset, (d) => { dataset = d });
            doneCallback(dataset);
        } catch (error) {
            console.error(error);
        }
    }

    static async readSavFile(file) {
        const data = new FormData();
        data.append('file', file);

        const response = await fetch(OpenCPU.BASE_URL + "library/haven/R/read_sav", { method: 'POST', body: data });
        if (!response.ok) throw new Error('Network response was not ok ID1');
        const responseText = await response.text();
        return getId(responseText);
    }

    static async getAttributes(id) {
        const data = new FormData();
        data.append('X', id);
        data.append('FUN', "function(x) attributes(x)");

        const response = await fetch(OpenCPU.BASE_URL + "library/base/R/lapply", { method: 'POST', body: data });
        if (!response.ok) throw new Error('Network response was not ok ID2');
        const responseText = await response.text();
        return getId(responseText);
    }

    static async getJson(id) {
        const response = await fetch(OpenCPU.BASE_URL + `/tmp/${id}/R/.val/json`);
        if (!response.ok) throw new Error('Network response was not ok for stats');
        return response.json();
    }

    static async getCodeLists(id) {
        const data = new FormData();
        data.append('X', id);
        data.append('FUN', "function(x) as.list(attributes(x)$labels)");

        const response = await fetch(OpenCPU.BASE_URL + "library/base/R/lapply", { method: 'POST', body: data });
        if (!response.ok) throw new Error('Network response was not ok ID3');
        const responseText = await response.text();
        return getId(responseText);
    }

    static async writeCsv(id) {
        const data = new FormData();
        data.append('x', id);
        data.append('file', "'data.csv'");

        const response = await fetch(OpenCPU.BASE_URL + "library/utils/R/write.csv", { method: 'POST', body: data });
        if (!response.ok) throw new Error('Network response was not ok for writeCSV');
        const responseText = await response.text();
        return getId(responseText);
    }

    static async getCsv(id) {
        const response = await fetch(OpenCPU.BASE_URL + `/tmp/${id}/files/data.csv`);
        if (!response.ok) throw new Error('Network response was not ok for getCSV');
        return response.text();
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