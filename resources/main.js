const { createApp, ref, reactive, computed } = Vue

createApp({
    methods:{
        openCsv(){
            let inputElement = document.createElement("input")
            inputElement.type = "file"
            inputElement.accept = ".csv,.tsv"
            inputElement.onchange = _ => {
                let file = Array.from(inputElement.files)[0];
                this.input.fileName = file.name
                
                this.input.type = file.type
                this.input.size = file.size
                var reader = new FileReader()
                reader.readAsText(file, "UTF-8")

                reader.onload = readerEvent => {
                    var content = readerEvent.target.result
                    this.input.delimiter = guessDelimiter(content)
                    this.input.raw = content
                    this.reloadDataset()
                }
            };
            inputElement.click();
        },
        saveFile(content, type, fileName){
            var fileAsBlob = new Blob([ content ], { type: type })
            //saveFileBrowser(fileName, fileAsBlob)
        },
        loadExample(example){
        },
        copyToClipboard(text){
            navigator.clipboard.writeText(text).then(() => {
                console.log("Content copied to clipboard");
            },() => {
                console.error("Failed to cpy to clipboard");
            });
        },
        async reloadDataset(){
            if(this.input.fileName == null) return;
            /*
            this.input.fileHash.sha256 = await hashString(this.input.raw, "SHA-256")

            this.input.fileNameWithoutExtension = this.input.fileName.split(".").slice(0, -1).join(".");
            console.log(this.input.fileNameWithoutExtension)
            var csv = CSVToArray(this.input.raw, this.input.delimiter)
            
            this.input.recordCount = csv.length
            if(this.input.firstRowIsHeader) this.input.recordCount--

            this.input.columns.splice(0)
            var pos = 0
            for(const id of csv[0]){
                var values = getColumnValues(csv, pos, this.input.firstRowIsHeader)
                this.input.columns.push(new Column(id, pos, values))
                pos++
            }*/
        }
    },
    mounted(){
        this.reloadDataset()
    },
    setup() {
        const codeListVariableIndex = ref(null)
        const examples = reactive([{},{}])
        const dataset = reactive(new Dataset("","t.csv","text/csv",","))
        const input = reactive({
            fileName: null,
            fileHash: {
                sha256: ""
            },
            raw: "",
            fileNameWithoutExtension: "",
            type: "text/csv",
            delimiter: ",",
            firstRowIsHeader: true,
            columns: [],
            recordCount : 0
        })
        const cv = {
            colRoles : [{id: "Dimension"}, {id: "Attribute"}, {id: "Measure"}],
        }

        return {
            input, cv
        }
    }
}).mount("#app")