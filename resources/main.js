const { createApp, ref, reactive, computed } = Vue

createApp({
  methods: {
    async openCsv(event) {
      const file = event.target.files[0]
      document.title = file.name + " - Nectar Publisher"
      await Parser.parseFile(file, (d) => this.dataset = d)
    },
    saveFile(content, type, fileName) {
      var fileAsBlob = new Blob([content], { type: type })
      //saveFileBrowser(fileName, fileAsBlob)
    },
    loadExample(example) {
    },
    copyToClipboard(text) {
      copyTextToClipboard(text)
    },
    async reloadDataset() {

    }
  },
  mounted() {
    this.reloadDataset()
  },
  setup() {
    const examples = reactive([{}, {}])
    const dataset = ref(new Dataset(null, null, "text/csv", ","))
    const cv = {
      colRoles: [{ id: "Dimension" }, { id: "Attribute" }, { id: "Measure" }],
      representationType: [{ id: "text", label: "Text" }, { id: "numeric", label: "Numeric" }, { id: "code", label: "Code" }, { id: "datetime", label: "Date time" }, { id: "other", label: "Other" }]
    }

    const appMetadata = computed(() => {
      return JSON.parse(document.head.querySelector('script[type="application/ld+json"]').innerText)
    })

    return {
      dataset, cv, appMetadata
    }
  }
}).mount("#app")