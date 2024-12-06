const { createApp, ref, reactive, computed } = Vue

var ColumnRow =  {
  props:['column'],
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <div class="mb-2">
      <input v-model="column.name">
    </div>`
}


const app = createApp({
  components: {ColumnRow: ColumnRow},
  methods: {
    async importDataFromFile(event) {
      this.input.file = event.target.files[0]
      document.title = `${this.input.file.name} - ${ this.appMetadata.name}`
      await Parser.parseFile(this.input.file, (d) => this.input.dataset = d)
    },
    async importDataFromService(event) {
      this.input.file = event.target.files[0]
      document.title = `${this.input.file.name} - ${ this.appMetadata.name}`
      // TODO: call service and get the metadata
      await OpenCPU.parseFile(this.input.file, (d) => this.input.dataset = d)
    },
    async importMetadata(event) {
      if (this.input.file === null){
        console.log('Data file must already exist!');
      } else {
        //this.meta.file = event.target.files[0]
        this.input.dataset.columns = importDdiCMetadata(event.target.files[0], this.input.dataset.columns)
      }
    },
    saveFile(content, type, fileName) {
      var fileAsBlob = new Blob([content], { type: type })
      saveFileBrowser(fileName, fileAsBlob)
    },
    copyToClipboard(text) {
      copyTextToClipboard(text)
    }
  },
  mounted() {},
  setup() {
    const codeListVariableIndex = ref(null)
    const input = reactive({
      file: null,
      dataset: new Dataset()
    })
    const cv = {
      representationType: RepresentationTypes
    }
    const appMetadata = computed(() => {
      return JSON.parse(document.head.querySelector('script[type="application/ld+json"]').innerText)
    })
    const output = computed(() => {
      return {
        filename: input.file?.name?.split('.').slice(0, -1).join('.'),
        markdown: datasetToMarkdown(input.dataset),
        csv: [
          input.dataset.columns.map(e => e.name).join(input.dataset.delimiter),
          ...input.dataset.data.map(e => e.join(input.dataset.delimiter))
        ].join('\n'),
        json: toDdiCdiJsonLd(input.dataset),
        cdi_data : toDdiCdiJsonLd(input.dataset),
        cdi : (hljs.highlight(toDdiCdiJsonLd(input.dataset), { language: "json" }).value),
        ddic_data : toDdiCXml(input.dataset),
        ddic : (hljs.highlight(toDdiCXml(input.dataset), { language: "xml" }).value),
        ddil_data : toDdiLXml(input.dataset),
        ddil : (hljs.highlight(toDdiLXml(input.dataset), { language: "xml" }).value),
        ddi40l_data : toDdi40LJson(input.dataset),
        ddi40l : (hljs.highlight(toDdi40LJson(input.dataset), { language: "json" }).value)
      }
    })

    return {
      input, cv, appMetadata, output, codeListVariableIndex
    }
  }
}).mount("#app")
