<script setup>
import { Dataset } from './modules/models.js'
import { RepresentationTypes, Parser } from './modules/utils.js'
import { ref, reactive, computed } from 'vue'
import { WebR } from 'webr'
import About from './components/About.vue'


const ddi = ref('');
const state = ref('init');

/*
const webR = new WebR();
webR.init();
console.info('Installing DDIwR package...');
webR.installPackages(["DDIwR"]).then(() => {
  console.info('DDIwR package installed!');
  state.value = 'idle';
});
*/

const codeListVariableIndex = ref(null)
const input = reactive({
	file: null,
	dataset: new Dataset(),
	debug: false
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

async function importDataFromFile(event) {
    input.file = event.target.files[0]
    document.title = `${input.file.name} - ${ appMetadata.name}`
    await Parser.parseFile(input.file, (d) => input.dataset = d)
	console.log(input.dataset)
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
					aria-label="version">{{ appMetadata.softwareVersion }}</span></a>
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
							<li><a class="dropdown-item" href="#">export option 1</a></li>
							<li><a class="dropdown-item" href="#">export option 2</a></li>
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
						<input v-model="input.debug" type="checkbox" class="btn-check" id="btn-debug" autocomplete="off">
						<label class="btn btn-light" for="btn-debug"><span v-if="input.debug">☒</span><span v-if="!input.debug">☐</span> debug</label>

					</li>
				</ul>
			</div>
		</div>
	</nav>

	<About :appMetadata="appMetadata" />

	<input ref="inputFile" id="inputFile" @change="importDataFromFile" type="file" accept=".csv,.tsv,.xlsx,.xls,.ods,.sav,.dta,.sas7bdat,text/csv" style="display: none;">
	<input ref="inputFileToRemote" id="inputFileToRemove" @change="importDataFromService" type="file" accept=".sav" style="display: none;">
	<input ref="inputMetadata" id="inputMetadata" @change="importMetadata" type="file" accept=".xml" style="display: none;">
</template>