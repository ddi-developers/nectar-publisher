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
    saveFile(content, type, fileName) {
      var fileAsBlob = new Blob([content], { type: type })
      //saveFileBrowser(fileName, fileAsBlob)
    },
    copyToClipboard(text) {
      copyTextToClipboard(text)
    }
  },
  mounted() {},
  setup() {
    const input = reactive({
      file: null,
      dataset: new Dataset()
    })
    const cv = {
      representationType: [{ id: "text", label: "Text" }, { id: "numeric", label: "Numeric" }, { id: "code", label: "Code" }, { id: "datetime", label: "Date time" }, { id: "other", label: "Other" }]
    }
    const appMetadata = computed(() => {
      return JSON.parse(document.head.querySelector('script[type="application/ld+json"]').innerText)
    })
    const output = computed(() => {
      return {
        markdown: datasetToMarkdown(input.dataset)
      }
    })

    return {
      input, cv, appMetadata, output
    }
  }
}).mount("#app")