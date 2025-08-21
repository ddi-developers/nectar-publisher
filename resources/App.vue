<script setup>
import { Dataset } from './models/Dataset.ts'
import { RepresentationTypes, Parser } from './modules/utils.js'
import { ref, reactive, computed } from 'vue'
import About from './components/About.vue'
import { toDdiCXml } from './modules/formatters/ddi-c-xml.js'
import { toDdiLXml } from './modules/formatters/ddi-l-xml.js'
import { saveFileBrowser, copyTextToClipboard } from './helpers/browser.ts'
import { watch } from 'vue'


const app = reactive({
	debug: localStorage.getItem('nectar-publisher-debug') === 'true',
	state: 'init'
});

watch(() => app.debug, (newValue) => {
	localStorage.setItem('nectar-publisher-debug', newValue);
});

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

const output = computed(() => {
	return {
		filename: input.file?.name?.split('.').slice(0, -1).join('.'),
		//markdown: datasetToMarkdown(input.dataset),
		csv: [
			input.dataset.columns.map(e => e.name).join(input.dataset.delimiter),
			...input.dataset.data.map(e => e.join(input.dataset.delimiter))
		].join('\n'),
		//cdi: toDdiCdiJsonLd(input.dataset),
		
		ddic : toDdiCXml(input.dataset),
		ddil : toDdiLXml(input.dataset),
		//ddi40l : toDdi40LJson(input.dataset),

	}
})

async function importDataFromFile(event) {
    input.file = event.target.files[0]
    document.title = `${input.file.name} - ${ appMetadata.name}`
    await Parser.parseFile(input.file, (d) => input.dataset = d)
}

function saveFile(content, type, fileName) {
	var fileAsBlob = new Blob([content], { type: type })
	saveFileBrowser(fileName, fileAsBlob)
}
</script>
<template>
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
	<section id="variables">
		<div class="row" v-if="input.dataset.fileName != null">
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

	<section id="debug" v-if="app.debug">
		<ul class="nav nav-tabs" id="exportTabs" role="tablist">
			<li class="nav-item" role="presentation">
				<button class="nav-link" id="csv-tab" data-bs-toggle="tab" data-bs-target="#csv-tab-pane" type="button" role="tab" aria-controls="csv-tab-pane"> csv (text/csv)</button>
			</li>
			<li class="nav-item" role="presentation">
				<button class="nav-link active" id="ddi-c-tab" data-bs-toggle="tab" data-bs-target="#ddi-c-tab-pane" type="button" role="tab" aria-controls="ddi-c-tab-pane" aria-selected="true"> ddi-c (xml)</button>
			</li>
			<li class="nav-item" role="presentation">
				<button class="nav-link" id="ddi-l-tab" data-bs-toggle="tab" data-bs-target="#ddi-l-tab-pane" type="button" role="tab" aria-controls="ddi-l-tab-pane"> ddi-l (xml)</button>
			</li>
		</ul>

		<div class="tab-content exports">
			<div class="tab-pane fade" id="csv-tab-pane" role="tabpanel" aria-labelledby="csv-tab" tabindex="0">
				<div class="more">
					<button class="btn btn-outline-primary" @click="saveFile(output.csv, 'text/csv', output.filename + '.csv')">💾save</button>
					<button class="btn btn-outline-primary" @click="copyTextToClipboard(output.csv)">📋copy</button>
				</div>
				<highlightjs :code="output.csv" language="csv"/>
			</div>

			<div class="tab-pane fade show active" id="ddi-c-tab-pane" role="tabpanel" aria-labelledby="ddi-c-tab" tabindex="1">
				<div class="more">
					<button class="btn btn-outline-primary" @click="saveFile(output.ddic, 'application/xml', output.filename + '.ddi-c.xml')">💾save</button>
					<button class="btn btn-outline-primary" @click="copyTextToClipboard(output.ddic)">📋copy</button>
				</div>
				<highlightjs :code="output.ddic" language="xml"/>
			</div>

			<div class="tab-pane fade" id="ddi-l-tab-pane" role="tabpanel" aria-labelledby="ddi-l-tab" tabindex="2">
				<div class="more">
					<button class="btn btn-outline-primary" @click="saveFile(output.ddil, 'application/xml', output.filename + '.ddi-l.xml')">💾save</button>
					<button class="btn btn-outline-primary" @click="copyTextToClipboard(output.ddil)">📋copy</button>
				</div>
				<highlightjs :code="output.ddil" language="xml"/>
			</div>
		</div>
	</section>

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