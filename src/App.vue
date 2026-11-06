<script setup>
import { Dataset } from './models/Dataset.ts'
import { Parser } from './modules/utils.js'
import { ref, reactive, computed, watch } from 'vue'
import { Marked } from 'marked'
import About from './components/About.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import DebugSection from './components/DebugSection.vue'
import AppNavbar from './components/layout/AppNavbar.vue'
import VariableList from './components/variables/VariableList.vue'
import CodeListModal from './components/variables/CodeListModal.vue'
import QuestionList from './components/questionnaire/QuestionList.vue'
import AnswerSetModal from './components/questionnaire/AnswerSetModal.vue'
import { toDdiCXml } from './modules/formatters/ddi-c-xml.js'
import { toDdiLXml } from './modules/formatters/ddi-l-xml.js'
import { toDdi40LJson } from './modules/formatters/ddi-40-l-json.js'
import { toDdiCdiJsonLd } from './modules/formatters/ddi-cdi-json-ld.js'
import { toMarkdown } from './modules/formatters/markdown.js'

const app = reactive({
	debug: localStorage.getItem('nectar-publisher-debug') === 'true',
	state: 'init'
})

watch(() => app.debug, (newValue) => {
	localStorage.setItem('nectar-publisher-debug', newValue)
})

const loading = ref(false)
const inputFile = ref(null)
const inputMetadata = ref(null)
const codeListVariableIndex = ref(null)
const answerSetUuid = ref('')
const input = reactive({
	file: null,
	dataset: new Dataset()
})

const appMetadata = computed(() => {
	return JSON.parse(
		document.head.querySelector('script[type="application/ld+json"]').innerText
	)
})

const marked = new Marked({ gfm: true })

const output = computed(() => {
	return {
		filename: input.file?.name?.split('.').slice(0, -1).join('.'),
		csv: [
			input.dataset.columns.map(e => e.name).join(input.dataset.delimiter),
			...input.dataset.data.map(e => e.join(input.dataset.delimiter))
		].join('\n'),
		ddiCdi: toDdiCdiJsonLd(input.dataset),
		ddic: toDdiCXml(input.dataset),
		ddil: toDdiLXml(input.dataset),
		ddi40l: toDdi40LJson(input.dataset),
		markdown: toMarkdown(input.dataset),
		html: marked.parse(toMarkdown(input.dataset)) // html is generated from the markdown through the "marked" library
	}
})

async function importDataFromFile(event) {
	input.file = event.target.files[0]
	document.title = `${input.file.name} - ${appMetadata.value.name}`
	loading.value = true
	try {
		await Parser.parseFile(input.file, (d) => input.dataset = d)
	} finally {
		loading.value = false
	}
}
</script>
<template>
	<div v-if="loading" class="loading-overlay" role="status" aria-live="polite">
		<LoadingSpinner text="Loading" />
		<p class="mt-3 mb-0">Importing file, the first import of some formats can take a while...</p>
	</div>

	<AppNavbar
		v-model:debug="app.debug"
		:app-metadata="appMetadata"
		:output="output"
		@import-data="inputFile.click()"
		@import-metadata="inputMetadata.click()" />

	<main class="container-fluid px-3 px-xl-4 py-3">
		<template v-if="input.dataset.fileName != null">
			<ul class="nav nav-tabs mb-3" id="myTab" role="tablist">
				<li class="nav-item" role="presentation">
					<button class="nav-link active" id="variable-tab" data-bs-toggle="tab" data-bs-target="#variable-tab-pane" type="button" role="tab" aria-controls="variable-tab-pane" aria-selected="true">📝Variables</button>
				</li>
				<li class="nav-item" role="presentation">
					<button class="nav-link" id="questionnaire-tab" data-bs-toggle="tab" data-bs-target="#questionnaire-tab-pane" type="button" role="tab" aria-controls="questionnaire-tab-pane" aria-selected="false">🗂️Associated questionnaire</button>
				</li>
			</ul>
			<div class="tab-content" id="myTabContent">
				<div class="tab-pane fade show active" id="variable-tab-pane" role="tabpanel" aria-labelledby="variable-tab" tabindex="0">
					<VariableList
						:columns="input.dataset.columns"
						:questions="input.dataset.associatedQuestionnaire.questions"
						@edit-codelist="codeListVariableIndex = $event" />
				</div>
				<div class="tab-pane fade" id="questionnaire-tab-pane" role="tabpanel" aria-labelledby="questionnaire-tab" tabindex="0">
					<QuestionList
						:questionnaire="input.dataset.associatedQuestionnaire"
						@manage-answer-sets="answerSetUuid = $event" />
				</div>
			</div>
		</template>

		<DebugSection v-if="app.debug" :output="output" />
	</main>

	<CodeListModal :column="codeListVariableIndex != null ? input.dataset.columns[codeListVariableIndex] : null" />
	<AnswerSetModal v-model:uuid="answerSetUuid" :questionnaire="input.dataset.associatedQuestionnaire" />
	<About :appMetadata="appMetadata" />

	<input ref="inputFile" id="inputFile" @change="importDataFromFile" type="file" accept=".csv,.tsv,.xlsx,.xls,.ods,.sav,.dta,.sas7bdat,text/csv" style="display: none;">
	<input ref="inputMetadata" id="inputMetadata" type="file" accept=".xml" style="display: none;">
</template>
