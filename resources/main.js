const { createApp, ref, reactive, computed } = Vue

createApp({
    methods:{
        async openCsv(event){
            console.log(event.target.files);
            //let inputElement = document.getElementsByClassName("file")
                
            Papa.parse(event.target.files[0], {
                complete: function(results) {
                    console.log(results);
                }
            });

            this.dataset.sha256 = await checksum(event.target.files[0], "SHA-256")
            console.log("SHA-256: ", sha256)

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
            input, dataset, cv
        }
    }
}).mount("#app")