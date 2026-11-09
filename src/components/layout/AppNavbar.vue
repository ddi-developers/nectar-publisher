<script setup>
import { saveFileBrowser } from '../../helpers/browser.ts'

defineProps({
	appMetadata: { type: Object, required: true },
	output: { type: Object, required: true }
})
const debug = defineModel('debug', { type: Boolean, default: false })
defineEmits(['import-data', 'import-metadata'])

function saveFile(content, type, fileName) {
	const fileAsBlob = new Blob([content], { type: type })
	saveFileBrowser(fileName, fileAsBlob)
}
</script>
<template>
	<nav class="navbar navbar-expand-lg bg-body-tertiary px-3">
		<div class="container-fluid">
			<a class="navbar-brand d-flex flex-wrap align-items-center gap-2 text-wrap" href="#">
				<span class="d-inline-flex align-items-center gap-2 text-nowrap">
					<span class="nectar-publisher-logo flex-shrink-0"></span>
					<span>{{ appMetadata.name }}</span>
				</span>
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
			<div id="navbar" class="collapse navbar-collapse">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-2 align-items-lg-center">
					<li class="nav-item">
						<button
							@click="$emit('import-data')"
							type="button"
							class="btn btn-light"
							title="open csv/tsv, R, Stata, SPSS, SAS or spreadsheet">📂 import data</button>
					</li>
					<li class="nav-item">
						<button
							@click="$emit('import-metadata')"
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
						<input v-model="debug" type="checkbox" class="btn-check" id="btn-debug" autocomplete="off">
						<label class="btn btn-light" for="btn-debug"><span v-if="debug">☒</span><span v-if="!debug">☐</span> debug</label>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>
