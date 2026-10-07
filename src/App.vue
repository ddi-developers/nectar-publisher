<script setup>
import { Dataset } from './models/Dataset.ts'
import { RepresentationTypes, Parser } from './modules/utils.js'
import { ref, reactive, computed } from 'vue'
import { Marked } from 'marked';
import About from './components/About.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import DebugSection from './components/DebugSection.vue'
import { toDdiCXml } from './modules/formatters/ddi-c-xml.js'
import { toDdiLXml } from './modules/formatters/ddi-l-xml.js'
import { toDdi40LJson } from './modules/formatters/ddi-40-l-json.js'
import { toDdiCdiJsonLd } from './modules/formatters/ddi-cdi-json-ld.js'
import { toMarkdown} from './modules/formatters/markdown.js'
import { saveFileBrowser } from './helpers/browser.ts'
import { watch } from 'vue'




const app = reactive({
	debug: localStorage.getItem('nectar-publisher-debug') === 'true',
	state: 'init'
});

watch(() => app.debug, (newValue) => {
	localStorage.setItem('nectar-publisher-debug', newValue);
});

const loading = ref(false)
const codeListVariableIndex = ref(null)
const input = reactive({
	file: null,
	dataset: new Dataset()
})
const cv = {
	representationType: RepresentationTypes
}
const appMetadata = computed(() => {
	return JSON.parse(
		document.head.querySelector('script[type="application/ld+json"]').innerText
	)
})

const marked = new Marked({ gfm: true });

const output = computed(() => {
	return {

		
		filename: input.file?.name?.split('.').slice(0, -1).join('.'),
		csv: [
			input.dataset.columns.map(e => e.name).join(input.dataset.delimiter),
			...input.dataset.data.map(e => e.join(input.dataset.delimiter))
		].join('\n'),
		ddiCdi: toDdiCdiJsonLd(input.dataset),
		ddic : toDdiCXml(input.dataset),
		ddil : toDdiLXml(input.dataset),
		ddi40l : toDdi40LJson(input.dataset),
		markdown: toMarkdown(input.dataset),
		html: marked.parse(toMarkdown(input.dataset)) // html is generated from the markdown through the "marked" library

	}
})

async function importDataFromFile(event) {
    input.file = event.target.files[0]
    document.title = `${input.file.name} - ${ appMetadata.name}`
    loading.value = true
    try {
        await Parser.parseFile(input.file, (d) => input.dataset = d)
    } finally {
        loading.value = false
    }
}

function deleteQuestion(uuid) {
	const questionnaire = input.dataset.associatedQuestionnaire
	questionnaire.questions = questionnaire.questions.filter(q => q.uuid !== uuid)
}

function saveFile(content, type, fileName) {
	var fileAsBlob = new Blob([content], { type: type })
	saveFileBrowser(fileName, fileAsBlob)
}
</script>
<template>
	<div v-if="loading" class="loading-overlay" role="status" aria-live="polite">
		<LoadingSpinner text="Loading" />
		<p class="mt-3 mb-0">Importing file, the first import of some formats can take a while...</p>
	</div>

	<!-- Application toolbar -->
	<nav class="row navbar navbar-expand-lg bg-body-tertiary">
		<div class="container-fluid">
			<a class="navbar-brand" href="#">
				<span class="nectar-publisher-logo"></span> 
				{{ appMetadata.name }} 
				<span 
					class="badge bg-secondary"
					aria-label="version">
					{{ appMetadata.softwareVersion }}
				</span>
			</a>
			<button 
				class="navbar-toggler" 
				type="button" 
				data-bs-toggle="collapse" 
				data-bs-target="#navbar"
				aria-controls="navbar" 
				aria-expanded="false" 
				aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div id="navbar" class="collapse navbar-collapse navbar-expand-md">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<button 
							@click="$refs.inputFile.click()" 
							type="button" 
							class="btn btn-light"
							title="open csv/tsv, R, Stata, SPSS, SAS or spreadsheet">📂 import data</button>
					</li>
					<li class="nav-item">
						<button 
							@click="$refs.inputMetadata.click()" 
							type="button" 
							class="btn btn-light"
							title="import metadata from DDI-C">📄 import metadata</button>
					</li>

					<li class="nav-item">
						<div class="btn-group" role="group">
							<button type="button" class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
								📤 export
							</button>
							<ul class="dropdown-menu">
								<li><a class="dropdown-item" href="#" @click="saveFile(output.ddic, 'application/xml', output.filename + '.ddi-c.xml')">DDI Codebook 2.5</a></li>
								<li><a class="dropdown-item" href="#" @click="saveFile(output.ddil, 'application/xml', output.filename + '.ddi-l.xml')">DDI Lifecycle 3.3</a></li>
								<li><a class="dropdown-item" href="#" @click="saveFile(output.ddiCdi, 'application/ld+json', output.filename + '.jsonld')">DDI-CDI (JSON-LD)</a></li>
								<li><a class="dropdown-item" href="#" @click="saveFile(output.ddi40l, 'application/json', output.filename + '.ddi-4.0-l.json')">DDI Lifecycle 4.0 (JSON)</a></li>
								<li><hr class="dropdown-divider"></li>
								<li><a class="dropdown-item" href="#" @click="saveFile(output.markdown, 'text/markdown', output.filename + '.md')">Markdown</a></li>
								<li><a class="dropdown-item" href="#" @click="saveFile(output.html, 'text/html', output.filename + '.html')">HTML</a></li>
								<li><a class="dropdown-item" href="#" @click="saveFile(output.csv, 'text/csv', output.filename + '.csv')">CSV</a></li>
							</ul>
						</div>
					</li>

					<li class="nav-item">
						<button 
							type="button" 
							class="btn btn-light" 
							data-bs-toggle="modal"
							data-bs-target="#aboutModal" 
							title="about this app">ℹ️ about</button>
					</li>

					<li class="nav-item">
						<input v-model="app.debug" type="checkbox" class="btn-check" id="btn-debug" autocomplete="off">
						<label class="btn btn-light" for="btn-debug"><span v-if="app.debug">☒</span><span v-if="!app.debug">☐</span> debug</label>
					</li>
				</ul>
			</div>
		</div>
	</nav>
	<ul class="nav nav-tabs" id="myTab" role="tablist" v-if="input.dataset.fileName != null">
		<li class="nav-item" role="presentation">
			<button class="nav-link active" id="variable-tab" data-bs-toggle="tab" data-bs-target="#variable-tab-pane" type="button" role="tab" aria-controls="variable-tab-pane" aria-selected="true">📝Variables</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="questionnaire-tab" data-bs-toggle="tab" data-bs-target="#questionnaire-tab-pane" type="button" role="tab" aria-controls="questionnaire-tab-pane" aria-selected="false">🗂️Associated questionnaire</button>
		</li>
	</ul>
	<div class="tab-content" id="myTabContent" v-if="input.dataset.fileName != null">
	<div class="tab-pane fade show active" id="variable-tab-pane" role="tabpanel" aria-labelledby="variable-tab" tabindex="0">
	<section id="variables">
		<div class="row">
			<form class="mb-2" v-for="(column, index) in input.dataset.columns" :class="{ 'bg-light rounded': column.showDetails }">
				<div class="row">
					<div class="shrink">
						<span>{{column.position}}</span>
					</div>
					<div class="col-md-2">
						<label class="form-label" :class="{notFirst: (index > 0)}">Name</label>
						<input v-model="column.name" type="text" class="form-control" disabled readonly>
					</div>
					<div class="col-md-5 label">
						<label class="form-label" :class="{notFirst: (index > 0)}">Label</label>
						<input v-model="column.label" type="text" class="form-control">
					</div>
					<div class="col-md-2">
						<label class="form-label" :class="{notFirst: (index > 0)}">Type</label>
						<div class="input-group">
							<select v-model="column.hasIntendedDataType" class="form-select">
								<option v-for="colType in cv.representationType" :value="colType">{{ colType.label }}</option>
							</select>
							<Transition>
								<button v-if="column.hasIntendedDataType?.id == 'Code'" class="btn btn-outline-secondary" type="button" title="document codelist">🧾</button>
							</Transition>
						</div>
					</div>
					<div class="col-md-1">
						<label class="form-label row codeCheckLabel"
								:class="{notFirst: (index > 0)}">Coded</label>
						<div class="btn-group" role="group" aria-label="coded variable">
							<input v-model="column.coded" @change="column.createCodeList()" type="checkbox"
									class="btn-check" :id="'coded-'+column.id" autocomplete="off">
							<label class="btn btn-outline-secondary" :for="'coded-'+column.id">
								<span v-if="!column.coded">☐</span>
								<span v-if="column.coded">☒</span>
							</label>
							<button v-if="column.coded" @click="codeListVariableIndex=index"
									data-bs-toggle="modal" data-bs-target="#codeListModal" type="button"
									class="btn btn-outline-secondary">✏️
							</button>
						</div>
					</div>
					<div class="col-md-1">
						<label class="form-label row button-label"
								:class="{notFirst: (index > 0)}">Details</label>
						<button @click="column.showDetails = !column.showDetails" type="button"
								:class="{ 'bg-primary': column.showDetails }"
								class="btn btn-outline-secondary">⚙️
						</button>
					</div>

				</div>
				<Transition>
					<div v-if="column.showDetails" class="row details mb-2">
						<div class="mb-12">
							<label :for="'description-' + column.position" class="form-label">Description</label>
							<textarea v-model="column.description" class="form-control" :id="'description-' + column.position" rows="4"></textarea>
						</div>
						<div v-if="column.hasIntendedDataType.type == 'numeric' || column.hasIntendedDataType.type == 'decimal'" class="col-md-12">
							<label class="form-label">Unit</label>
							<input v-model="column.unit" list="unit-list" type="text" class="form-control">
							<!-- not a good way to do it, just a temp list... -->
							<datalist id="unit-list">
								<option>candela</option>
								<option>meter</option>
								<option>seconds</option>
								<option>mole</option>
								<option>ampere</option>
								<option>kelvin</option>
								<option>celcius</option>
								<option>kilogram</option>
								<option>percent</option>
								<option>pascal</option>
							</datalist>
						</div>
						<div v-if="column.hasIntendedDataType.type == 'decimal'" class="col-md-6">
							<label class="form-label">Decimal positions</label>
							<input v-model.number="column.decimalPositions" type="number" inputmode="numeric" pattern="[0-9]" step="1" min="0" class="form-control">
						</div>
						<div v-if="column.hasIntendedDataType.type == 'numeric' || column.hasIntendedDataType.type == 'decimal'" class="col-md-6">
							<label class="form-label">Accuracy</label>
							<input v-model.number="column.accuracy" type="number" inputmode="numeric" pattern="[0-9]" step="1" min="0" class="form-control">
						</div>
						<div class="col-md-6">
							<label class="form-label">Role</label>
							<select v-model="column.role" name="role" id="role" class="form-select">
								<option name="Identifier">Identifier</option>
								<option name="Measure">Measure</option>
								<option name="Attribute">Attribute</option>
							</select>
						</div>
					</div>
				</Transition>
				<hr class="mt-4" />
			</form>
		</div>
	</section>
	</div>

			  <!-- Questionnaire tab -->
			  <div class="tab-pane fade" id="questionnaire-tab-pane" role="tabpanel" aria-labelledby="questionnaire-tab" tabindex="0">
				  <form class="mb-2" v-for="(question, index) in input.dataset.associatedQuestionnaire.questions" :key="question.uuid" :class="{ 'bg-light rounded': question.showDetails }">
					  <div class="row">
						  <div class="shrink">
							  <span>{{index}}</span>
						  </div>
						  <div class="col-md-2">
							  <label class="form-label" :class="{notFirst: (index > 0)}">Nr</label>
							  <input v-model="question.questionNr" type="text" class="form-control">
						  </div>
						  <div class="col-md-5 label">
							  <label class="form-label" :class="{notFirst: (index > 0)}">Question Name</label>
							  <input v-model="question.questionName" type="text" class="form-control">
						  </div>
						  <div class="col-md-2">
							  <label class="form-label" :class="{notFirst: (index > 0)}">Type</label>
							  <div class="input-group">
								  <select v-model="question.answerType" class="form-select">
									  <option>coded</option>
									  <option>numeric</option>
									  <option>date/time</option>
									  <option>text</option>
								  </select>
							  </div>
						  </div>
						  <div class="col-md-1">
							  <label class="form-label row button-label"
									 :class="{notFirst: (index > 0)}">Details</label>
							  <button @click="question.showDetails = !question.showDetails" type="button"
									  :class="{ 'bg-primary': question.showDetails }"
									  class="btn btn-outline-secondary">⚙️
							  </button>
						  </div>
						  <div class="col-md-1">
							  <label class="form-label row button-label"
									 :class="{notFirst: (index > 0)}">Delete</label>
							  <button @click="deleteQuestion(question.uuid)" type="button"
									  :class="{ 'bg-primary': question.delete }"
									  class="btn btn-outline-secondary">🗑
							  </button>
						  </div>

					  </div>
					  <Transition>
						  <div v-if="question.showDetails" class="row details mb-2">
							  <div class="row details">
								  <div class="col-md-2">
									  <label class="form-label">multiple items</label>
									  <div class="btn-group" role="group" aria-label="coded variable">
										  <input v-model="question.multipleItems" @change="question.createItemList(input.dataset.associatedQuestionnaire)" type="checkbox"
												 class="btn-check" :id="'multipleItems-' + index" autocomplete="off">
										  <label class="btn btn-outline-secondary" :for="'multipleItems-' + index">
											  <span v-if="!question.multipleItems">☐</span>
											  <span v-if="question.multipleItems">☒</span>
										  </label>
									  </div>
								  </div>
								  <div class="col-md-2">
									  <label class="form-label">multiple answers</label>
									  <div class="btn-group" role="group" aria-label="coded variable">
										  <input v-model="question.multipleAnswers" type="checkbox"
												 class="btn-check" :id="'multipleAnswers-' + index" autocomplete="off">
										  <label class="btn btn-outline-secondary" :for="'multipleAnswers-' + index">
											  <span v-if="!question.multipleAnswers">☐</span>
											  <span v-if="question.multipleAnswers">☒</span>
										  </label>
									  </div>
								  </div>
							  </div>
							  <div class="row details mb-2">
								  <div class="col-md-2">
									  <label :for="'introText-' + index" class="form-label">Question intro text</label>
								  </div>
								  <div class="col-md-10">
									  <textarea v-model="question.introText" class="form-control" :id="'introText-' + index" rows="2"></textarea>
								  </div>
							  </div>
							  <div class="row details mb-2">
								  <div class="col-md-2">
									  <label :for="'questionText-' + index" class="form-label">Question text</label>
								  </div>
								  <div class="col-md-10">
									  <textarea v-model="question.questionText" class="form-control" :id="'questionText-' + index" rows="4"></textarea>
								  </div>
							  </div>
							  <div class="row details mb-2">
								  <div class="col-md-2">
									  <label :for="'outroText-' + index" class="form-label">Question outro text</label>
								  </div>
								  <div class="col-md-10">
									  <textarea v-model="question.outroText" class="form-control" :id="'outroText-' + index" rows="2"></textarea>
								  </div>
							  </div>
							  <div v-if="question.answerType == 'coded'" class="row details mb-2">
								  <div class="col-md-8">
									  <label class="form-label">Set of answer categories</label>
									  <input v-model="question.answerCodesReference" list="answer-list" type="text" class="form-control">
									  <!-- not a good way to do it, just a temp list... -->
									  <datalist id="answer-list">
										  <option v-for="codeList in input.dataset.associatedQuestionnaire.answers" :value="codeList.uuid">{{ codeList.name }}</option>
									  </datalist>
								  </div>
								  <div class="col-md-4">
									  <button type="button"
											  :class="{ 'bg-primary': question.showDetails }"
											  class="btn btn-outline-secondary">manage sets
									  </button>
								  </div>
							  </div>
							  <div v-if="question.multipleItems" class="row details">
								  <div class="row details mb-2" v-for="codeVal in input.dataset.associatedQuestionnaire.items.find(o => o.uuid == question.itemCodesReference).codeValues">
									  <div class="col-md-2">
										  <input v-model="codeVal.value" type="text" class="form-control" :id="'codeValueVal-' + index + codeVal.value"></input>
									  </div>
									  <div class="col-md-10">
										  <input v-model="codeVal.label" type="text" class="form-control" :id="'codeValueLab-' + index + codeVal.value"></input>
									  </div>
								  </div>
								  <div class="row details">
									  <div class="col-md-4">
										  <button @click="input.dataset.associatedQuestionnaire.items.find(o => o.uuid == question.itemCodesReference).addCode()" type="button"
												  :class="{ 'bg-primary': question.showDetails }"
												  class="btn btn-outline-secondary">add item
										  </button>
									  </div>
								  </div>
							  </div>
						  </div>
					  </Transition>
					  <hr class="mt-4" />
				  </form>
				  <button @click="input.dataset.associatedQuestionnaire.addQuestion()" type="button"
						  class="btn btn-outline-secondary">➕ add question
				  </button>
			  </div>

	</div>

	<DebugSection v-if="app.debug" :output="output" />

	<!-- MARK: Code List Modal -->
	<div class="modal modal-dialog-scrollable fade" id="codeListModal" tabindex="-1" aria-labelledby="codeListModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div v-if="codeListVariableIndex != null" class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="codeListModalLabel">📦Code list <span v-html="input.dataset.columns[codeListVariableIndex].name" class="badge bg-secondary"></span></h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form class="mb-4">
						<div class="row" v-for="(code, index) in input.dataset.columns[codeListVariableIndex].codeValues">
							<div class="col-md-4">
								<label class="form-label" :class="{notFirst: (index > 0)}">Code</label>
								<input v-model="code.value" type="text" class="form-control" disabled>
							</div>
							<div class="col-md-8">
								<label class="form-label" :class="{notFirst: (index > 0)}">Name</label>
								<input v-model="code.label" type="text" class="form-control">
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#codeListModal">Close</button>
				</div>
			</div>
		</div>
	</div>

	<About :appMetadata="appMetadata" />

	<input ref="inputFile" id="inputFile" @change="importDataFromFile" type="file" accept=".csv,.tsv,.xlsx,.xls,.ods,.sav,.dta,.sas7bdat,text/csv" style="display: none;">
	<input ref="inputMetadata" id="inputMetadata" @change="importMetadata" type="file" accept=".xml" style="display: none;">
</template>