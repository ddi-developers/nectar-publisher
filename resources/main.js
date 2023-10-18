const { createApp, ref, reactive, computed } = Vue

createApp({
    methods:{
        async openCsv(event){
            const file = event.target.files[0]
            document.title = file.name + " - Nectar Publisher"
            if(file.name.endsWith(".xlsx")){
                await Parser.parseSpreadsheet(file, (d) => this.dataset = d)
            }else{
                await Parser.parseDelimitedText(file, (d) => this.dataset = d)
            }
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
        const dataset = ref(new Dataset("","t.csv","text/csv",","))
        const cv = {
            colRoles : [{id: "Dimension"}, {id: "Attribute"}, {id: "Measure"}],
            representationType : ["text", "numeric", "code", "datetime", "other"]
        }

        return {
            dataset, cv
        }
    }
}).mount("#app")