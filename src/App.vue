<script setup>
import { Dataset } from './models/Dataset.ts'
import { RepresentationTypes, Parser } from './modules/utils.js'
import { ref, reactive, computed } from 'vue'
import { Marked } from 'marked';
import About from './components/About.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import DebugSection from './components/DebugSection.vue'
import RepeatableField from './components/RepeatableField.vue'
import { TitleTypes, Availabilities, ContributorRoles, TimeMethods, SamplingProcedures, CollectionModes, CollectionDateFormats,
	AlternativeTitle, Agent, Contributor, CollectionPeriod, Publication } from './models/StudyInformation.ts'
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
const answerSet = reactive({
	uuid: '',
	newValue: '',
	newLabel: ''
})
const selectedAnswerSet = computed(() => {
	return input.dataset.associatedQuestionnaire.answers.find(a => a.uuid == answerSet.uuid)
})
const input = reactive({
	file: null,
	dataset: new Dataset()
})
const cv = {
	representationType: RepresentationTypes,
	titleTypes: TitleTypes,
	availabilities: Availabilities,
	contributorRoles: ContributorRoles,
	timeMethods: TimeMethods,
	samplingProcedures: SamplingProcedures,
	collectionModes: CollectionModes,
	collectionDateFormats: CollectionDateFormats
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

function addAnswerSetCode() {
	if (!selectedAnswerSet.value) return
	selectedAnswerSet.value.addCode(answerSet.newValue, answerSet.newLabel)
	answerSet.newValue = ''
	answerSet.newLabel = ''
}

function addAnswerSet() {
	answerSet.uuid = input.dataset.associatedQuestionnaire.addAnswerSet().uuid
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

	<!-- Dataset tab -->
	<div class="tab-pane fade" id="dataset-tab-pane" role="tabpanel" aria-labelledby="dataset-tab" tabindex="0">
		<form class="mb-2">
			<div class="col-md-12 label">
				<label class="form-label" for="filename">File name</label>
				<input v-model="input.dataset.fileName" type="text" class="form-control" id="filename" disabled readonly>
			</div>
			<div class="col-md-12 label">
				<label class="form-label" for="studyname">Study name</label>
				<input v-model="input.dataset.studyName" type="text" class="form-control" id="studyname">
			</div>
			<div class="col-md-12 label">
				<label class="form-label" for="studydescription">Study description</label>
				<textarea v-model="input.dataset.studyDescription" class="form-control" id="studydescription" rows="4"></textarea>
			</div>
			<div class="col-md-12 label">
				<label class="form-label" for="studygroupname">Study group name</label>
				<input v-model="input.dataset.studyGroupName" type="text" class="form-control" id="studygroupname">
			</div>
			<div class="col-md-12 label">
				<label class="form-label" for="studygroupdescription">Study group description (only if study group has a name)</label>
				<textarea v-model="input.dataset.studyGroupDescription" class="form-control" id="studygroupdescription" rows="4"></textarea>
			</div>

			<!-- Basic information -->
			<h5 class="mt-4">Basic information</h5>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="alternativeTitle-0">Further titles</label>
				<div class="input-group mb-1" v-for="(altTitle, index) in input.dataset.studyInformation.alternativeTitles">
					<input v-model="altTitle.title" :id="'alternativeTitle-' + index" type="text" class="form-control" placeholder="Title">
					<select v-model="altTitle.type" class="form-select" title="type of title">
						<option value="" disabled>Type of title</option>
						<option v-for="titleType in cv.titleTypes" :value="titleType">{{ titleType }}</option>
					</select>
					<button @click="input.dataset.studyInformation.alternativeTitles.splice(index, 1)" type="button" class="btn btn-outline-secondary" title="remove entry">🗑</button>
				</div>
				<button @click="input.dataset.studyInformation.alternativeTitles.push(new AlternativeTitle())" type="button" class="btn btn-outline-secondary btn-sm" title="add entry">➕</button>
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="principalInvestigator-0">Principal investigators</label>
				<div class="input-group mb-1" v-for="(person, index) in input.dataset.studyInformation.principalInvestigators">
					<input v-model="person.name" :id="'principalInvestigator-' + index" type="text" class="form-control" placeholder="Last name, first name">
					<input v-model="person.institution" type="text" class="form-control" placeholder="Institution">
					<button @click="input.dataset.studyInformation.principalInvestigators.splice(index, 1)" type="button" class="btn btn-outline-secondary" title="remove entry">🗑</button>
				</div>
				<button @click="input.dataset.studyInformation.principalInvestigators.push(new Agent())" type="button" class="btn btn-outline-secondary btn-sm" title="add entry">➕</button>
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="publisher-0">Publishers</label>
				<RepeatableField id="publisher" :list="input.dataset.studyInformation.publishers" />
			</div>
			<div class="row mb-2">
				<div class="col-md-6">
					<label class="form-label" for="publicationYear">Publication year</label>
					<input v-model.number="input.dataset.studyInformation.publicationYear" type="number" step="1" min="1900" placeholder="yyyy" class="form-control" id="publicationYear">
				</div>
				<div class="col-md-6">
					<label class="form-label" for="availability">Availability</label>
					<select v-model="input.dataset.studyInformation.availability" class="form-select" id="availability">
						<option v-for="availability in cv.availabilities" :value="availability">{{ availability }}</option>
					</select>
				</div>
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="contributor-0">Contributors</label>
				<div class="input-group mb-1" v-for="(person, index) in input.dataset.studyInformation.contributors">
					<input v-model="person.name" :id="'contributor-' + index" type="text" class="form-control" placeholder="Last name, first name">
					<input v-model="person.institution" type="text" class="form-control" placeholder="Institution">
					<select v-model="person.role" class="form-select" title="type of contribution">
						<option value="" disabled>Type of contribution</option>
						<option v-for="role in cv.contributorRoles" :value="role">{{ role }}</option>
					</select>
					<button @click="input.dataset.studyInformation.contributors.splice(index, 1)" type="button" class="btn btn-outline-secondary" title="remove entry">🗑</button>
				</div>
				<button @click="input.dataset.studyInformation.contributors.push(new Contributor())" type="button" class="btn btn-outline-secondary btn-sm" title="add entry">➕</button>
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="funder-0">Funders</label>
				<RepeatableField id="funder" :list="input.dataset.studyInformation.funders" />
			</div>

			<!-- Content description -->
			<h5 class="mt-4">Content description</h5>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="subject-0">Subjects</label>
				<RepeatableField id="subject" :list="input.dataset.studyInformation.subjects" />
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="topicKeyword-0">Topic keywords</label>
				<RepeatableField id="topicKeyword" :list="input.dataset.studyInformation.topicKeywords" />
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="thesozKeyword-0">TheSoz keywords</label>
				<RepeatableField id="thesozKeyword" :list="input.dataset.studyInformation.thesozKeywords" />
			</div>

			<!-- Methodology -->
			<h5 class="mt-4">Methodology</h5>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="country-0">Geographic coverage – country (ISO 3166)</label>
				<RepeatableField id="country" :list="input.dataset.studyInformation.countries" placeholder="e.g. DE" />
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="region-0">Geographic coverage – region</label>
				<RepeatableField id="region" :list="input.dataset.studyInformation.regions" />
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="timeMethod-0">Time dimension</label>
				<RepeatableField id="timeMethod" :list="input.dataset.studyInformation.timeMethods" :options="cv.timeMethods" select />
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="universe">Universe</label>
				<input v-model="input.dataset.studyInformation.universe" type="text" class="form-control" id="universe">
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="samplingProcedure-0">Sampling procedures</label>
				<RepeatableField id="samplingProcedure" :list="input.dataset.studyInformation.samplingProcedures" :options="cv.samplingProcedures" placeholder="Choose an option" />
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="collectionMode-0">Modes of data collection</label>
				<RepeatableField id="collectionMode" :list="input.dataset.studyInformation.collectionModes" :options="cv.collectionModes" placeholder="Choose an option" />
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="collectionDateFormat">Date format of collection period</label>
				<select v-model="input.dataset.studyInformation.collectionDateFormat" class="form-select" id="collectionDateFormat">
					<option v-for="dateFormat in cv.collectionDateFormats" :value="dateFormat">{{ dateFormat }}</option>
				</select>
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="collectionStart-0">Collection period (start – end)</label>
				<div class="input-group mb-1" v-for="(period, index) in input.dataset.studyInformation.collectionPeriods">
					<input v-model="period.start" :id="'collectionStart-' + index" :placeholder="input.dataset.studyInformation.collectionDateFormat" type="text" class="form-control" title="start of data collection">
					<input v-model="period.end" :placeholder="input.dataset.studyInformation.collectionDateFormat" type="text" class="form-control" title="end of data collection">
					<button @click="input.dataset.studyInformation.collectionPeriods.splice(index, 1)" type="button" class="btn btn-outline-secondary" title="remove entry">🗑</button>
				</div>
				<button @click="input.dataset.studyInformation.collectionPeriods.push(new CollectionPeriod())" type="button" class="btn btn-outline-secondary btn-sm" title="add entry">➕</button>
			</div>

			<!-- Further notes -->
			<h5 class="mt-4">Further notes</h5>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="publicationCitation-0">Publications</label>
				<div class="input-group mb-1" v-for="(publication, index) in input.dataset.studyInformation.publications">
					<textarea v-model="publication.citation" :id="'publicationCitation-' + index" class="form-control" rows="2" placeholder="Citation"></textarea>
					<input v-model="publication.identifier" type="text" class="form-control" placeholder="Publication ID (e.g. DOI)">
					<button @click="input.dataset.studyInformation.publications.splice(index, 1)" type="button" class="btn btn-outline-secondary" title="remove entry">🗑</button>
				</div>
				<button @click="input.dataset.studyInformation.publications.push(new Publication())" type="button" class="btn btn-outline-secondary btn-sm" title="add entry">➕</button>
			</div>
			<div class="col-md-12 label mb-2">
				<label class="form-label" for="studyNotes">Notes on project/data</label>
				<textarea v-model="input.dataset.studyInformation.notes" class="form-control" id="studyNotes" rows="4"></textarea>
			</div>
		</form>
	</div>

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
						<div v-if="column.hasIntendedDataType.type == 'numeric' || column.hasIntendedDataType.type == 'decimal'" class="col-md-4">
							<label class="form-label">Accuracy</label>
							<input v-model.number="column.accuracy" type="number" inputmode="numeric" pattern="[0-9]" step="1" min="0" class="form-control">
						</div>
						<div class="col-md-4">
							<label class="form-label">Role</label>
							<select v-model="column.role" name="role" id="role" class="form-select">
								<option name="Identifier">Identifier</option>
								<option name="Measure">Measure</option>
								<option name="Attribute">Attribute</option>
							</select>
						</div>
						<div class="col-md-4">
							<label :for="'questionReference-' + index" class="form-label">Question Reference</label>
							<select v-model="column.questionReference" :id="'questionReference-' + index" class="form-select">
								<option v-for="question in input.dataset.associatedQuestionnaire.questions" :value="question.uuid">{{ question.questionName }}</option>
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
								  <div class="col-md-2">
									  <label :for="'answerCodesReference-' + index" class="form-label">Set of answer categories</label>
								  </div>
								  <div class="col-md-8">
									  <select v-model="question.answerCodesReference" :id="'answerCodesReference-' + index" class="form-select">
										  <option v-for="codeList in input.dataset.associatedQuestionnaire.answers" :value="codeList.uuid">{{ codeList.name }}</option>
									  </select>
								  </div>
								  <div class="col-md-2 text-end">
									  <button type="button"
											  @click="answerSet.uuid = question.answerCodesReference ?? ''"
											  data-bs-toggle="modal" data-bs-target="#answerSetModal"
											  :class="{ 'bg-primary': question.showDetails }"
											  class="btn btn-outline-secondary text-white">manage sets
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

	<!-- MARK: Answer Set Modal -->
	<div class="modal modal-dialog-scrollable fade" id="answerSetModal" tabindex="-1" aria-labelledby="answerSetModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="answerSetModalLabel">📦Sets of answer categories</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form class="mb-4" @submit.prevent>
						<div class="mb-3">
							<label for="answerSetSelect" class="form-label">Set</label>
							<select v-model="answerSet.uuid" id="answerSetSelect" class="form-select">
								<option v-for="codeList in input.dataset.associatedQuestionnaire.answers" :value="codeList.uuid">{{ codeList.name }}</option>
							</select>
						</div>
						<div v-if="selectedAnswerSet" class="mb-3">
							<label for="answerSetName" class="form-label">Set name</label>
							<input v-model="selectedAnswerSet.name" id="answerSetName" type="text" class="form-control">
						</div>
						<div v-if="selectedAnswerSet" class="mb-3">
							<label for="answerSetDescription" class="form-label">Set description</label>
							<textarea v-model="selectedAnswerSet.description" id="answerSetDescription" class="form-control" rows="3"></textarea>
						</div>
						<template v-if="selectedAnswerSet">
							<div class="row" v-for="(code, index) in selectedAnswerSet.codeValues">
								<div class="col-md-4">
									<label class="form-label" :class="{notFirst: (index > 0)}">Code</label>
									<input v-model="code.value" type="text" class="form-control">
								</div>
								<div class="col-md-8">
									<label class="form-label" :class="{notFirst: (index > 0)}">Name</label>
									<input v-model="code.label" type="text" class="form-control">
								</div>
							</div>
							<hr />
							<div class="row">
								<div class="col-md-4">
									<label for="answerSetNewValue" class="form-label">New code</label>
									<input v-model="answerSet.newValue" id="answerSetNewValue" type="text" class="form-control">
								</div>
								<div class="col-md-8">
									<label for="answerSetNewLabel" class="form-label">New name</label>
									<input v-model="answerSet.newLabel" id="answerSetNewLabel" type="text" class="form-control">
								</div>
							</div>
						</template>
					</form>
				</div>
				<div class="modal-footer">
					<button @click="addAnswerSetCode()" :disabled="!selectedAnswerSet" type="button" class="btn btn-outline-secondary">➕ add code to set</button>
					<button @click="addAnswerSet()" type="button" class="btn btn-outline-secondary">➕ add new set</button>
					<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>

	<About :appMetadata="appMetadata" />

	<input ref="inputFile" id="inputFile" @change="importDataFromFile" type="file" accept=".csv,.tsv,.xlsx,.xls,.ods,.sav,.dta,.sas7bdat,text/csv" style="display: none;">
	<input ref="inputMetadata" id="inputMetadata" @change="importMetadata" type="file" accept=".xml" style="display: none;">
</template>