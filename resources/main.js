const { createApp, ref, reactive, computed } = Vue

createApp({
    methods:{
        async openCsv(event){
            const file = event.target.files[0]
            console.log(file)

            this.dataset.fileName = file.name
            this.dataset.mimeType = file.type
            this.dataset.lastModified = new Date(file.lastModified).toISOString()
            var self = this
            Papa.parse(file, {
                complete: function(results) {
                    console.log(results);
                    self.dataset.delimiter = results.meta.delimiter
                    self.dataset.linebreak = results.meta.linebreak
                    
                }
            });

            this.dataset.sha256 = await checksum(file, "SHA-256")
            console.log(await this.dataset)
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

        }
    },
    mounted(){
        this.reloadDataset()
    },
    setup() {
        const codeListVariableIndex = ref(null)
        const examples = reactive([{},{}])
        const dataset = reactive(new Dataset("","t.csv","text/csv",","))
        const cv = {
            colRoles : [{id: "Dimension"}, {id: "Attribute"}, {id: "Measure"}],
        }

        return {
            dataset, cv
        }
    }
}).mount("#app")