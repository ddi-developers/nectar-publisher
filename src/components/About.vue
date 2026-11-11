<script setup>
import { computed, onUnmounted, ref } from 'vue'

const props = defineProps({
  appMetadata: {
    type: Object,
    required: true
  }
})

const copied = ref(false)
const formats = ['CSV', 'TSV', 'SPSS', 'Stata', 'SAS', 'XLS', 'XLSX', 'ODS']

const libraries = [
  { name: 'Papa Parse', url: 'https://www.papaparse.com' },
  { name: 'SheetJS CE', url: 'https://sheetjs.com' },
  { name: 'R-WASM', url: 'https://r-wasm.org' },
  { name: 'DDIwR', url: 'https://cran.r-project.org/web/packages/DDIwR' },
  { name: 'Vue.js', url: 'https://vuejs.org' },
  { name: 'Bootstrap', url: 'https://getbootstrap.com' }
]

const repository = 'https://github.com/ddi-developers/nectar-publisher'
const creators = computed(() => props.appMetadata?.creator ?? [])

const citation = computed(() => {
  const version = props.appMetadata?.softwareVersion 
  return `DDI Developers. Nectar Publisher${version ? ` (Version ${version})` : ''}. GitHub repository. ${repository}`
})

let copyResetTimeout
onUnmounted(() => clearTimeout(copyResetTimeout))

async function copyCitation() {
  try {
    await navigator.clipboard.writeText(citation.value)
    copied.value = true
    clearTimeout(copyResetTimeout)
    copyResetTimeout = setTimeout(() => { copied.value = false }, 2000)
  } catch (error) {
    console.error('Failed to copy citation:', error)
  }
}
</script>

<template>
  <div
    id="aboutModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="aboutModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content shadow-lg">
        <div class="modal-header align-items-start p-4">
          <div class="d-flex align-items-center gap-3">
            <span class="nectar-publisher-logo flex-shrink-0" aria-hidden="true"></span>
            <div>
              <div class="small text-body-secondary text-uppercase fw-semibold">About the application</div>
              <h1 id="aboutModalLabel" class="modal-title fs-4 fw-bold">
                {{ appMetadata.name }}
              </h1>
              <span v-if="appMetadata.softwareVersion" class="badge text-bg-light border mt-2">
                Version {{ appMetadata.softwareVersion }}
              </span>
            </div>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body px-4 py-0">
          <section class="py-4">
            <p>A lightweight, open-source application for documenting and publishing tabular datasets.</p>
            <div class="d-flex flex-wrap gap-2">
              <span v-for="format in formats" :key="format" class="badge text-bg-light border">
                {{ format }}
              </span>
            </div>
          </section>

          <section class="border-top py-4">
            <h2 class="h6 fw-bold mb-3">Open source</h2>
            <p class="small text-body-secondary">
              Nectar Publisher is developed openly. Explore the source code, report bugs, or suggest new features.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <a :href="repository" target="_blank" rel="noopener noreferrer" class="link-primary text-decoration-none">
                GitHub repository <span aria-hidden="true">↗</span>
              </a>
              <a :href="`${repository}/issues`" target="_blank" rel="noopener noreferrer" class="link-primary text-decoration-none">
                Report an issue <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>

          <section class="border-top py-4">
            <h2 class="h6 fw-bold mb-3">Built with</h2>
            <div class="d-flex flex-wrap gap-2">
              <a
                v-for="library in libraries"
                :key="library.name"
                :href="library.url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline-secondary btn-sm"
              >
                {{ library.name }} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>

          <section id="citation" class="border-top py-4">
            <h2 class="h6 fw-bold mb-3">How to cite</h2>
            <p class="small text-body-secondary">
              If you use Nectar Publisher in your research, please cite the software.
            </p>
            <div class="card bg-body-tertiary">
              <div class="card-body">
                <div class="small text-uppercase fw-semibold text-body-secondary mb-2">Suggested citation</div>
                <blockquote class="blockquote fs-6 mb-3 text-break">{{ citation }}</blockquote>
                <div class="d-flex justify-content-end">
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm"
                    :aria-label="copied ? 'Citation copied' : 'Copy citation'"
                    @click="copyCitation"
                  >
                    {{ copied ? '✓ Copied!' : '⧉ Copy citation' }}
                  </button>
                </div>
              </div>
            </div>
            <p class="small text-body-secondary mt-2 mb-0">
              Include the software version or commit hash used to ensure reproducibility.
            </p>
          </section>

          <section class="border-top py-4">
            <h2 class="h6 fw-bold mb-3">Created by</h2>
            <div class="list-group list-group-flush">
              <div
                v-for="(creator, index) in creators"
                :key="creator.id || index"
                class="list-group-item px-0 d-flex align-items-center justify-content-between gap-3"
              >
                <div class="flex-grow-1 text-break">
                  <div class="fw-semibold small">{{ creator.name }}</div>
                  <div v-if="creator.affiliation?.name" class="small text-body-secondary mt-1">
                    {{ creator.affiliation.name }}
                  </div>
                </div>
                <a
                  v-if="creator.id"
                  :href="creator.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="small link-secondary text-decoration-none flex-shrink-0"
                  :aria-label="`View ${creator.name}'s ORCID profile`"
                >
                  ORCID <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </section>
        </div>

        <div class="modal-footer px-4 py-3">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
