<script setup>
defineProps({
    appMetadata: Object
})
</script>
<template>
	<div class="modal modal-dialog-scrollable fade modal-lg" id="aboutModal" tabindex="-2" aria-labelledby="aboutModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
						<h1 class="modal-title fs-5" id="aboutModallLabel">
							<span class="nectar-publisher-logo"></span>
							About {{ appMetadata.name }}</h1>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<p>
						Nectar Publisher aims to be a lightweight simple documentation tool for tabular data.<br>
						Currenty supports CSV, TSV and XLSX.
					</p>
					
					Libraries used:
					<ul>
						<li><a href="https://www.papaparse.com" target="_blank">Papa Parse</a></li>
						<li><a href="https://sheetjs.com" target="_blank">Sheet JS CE</a></li>
						<li><a href="https://r-wasm.org">R-WASM</a></li>
						<li><a href="https://cran.r-project.org/web/packages/DDIwR">DDIwR</a></li>
						<li><a href="https://vuejs.org" target="_blank">Vue.js</a></li>
						<li><a href="https://getbootstrap.com" target="_blank">Bootstrap</a></li>
					</ul>
						
					<h5>Created by</h5>
						
    				<ul>
						<li v-for="creator in appMetadata.creator">
							<span>
								{{ creator.name }}, 
								{{ creator.affiliation.name }}&nbsp;
							</span>
							<a :href="creator.id">
								<img alt="ORCID logo"
									src="data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%3C!--%20Generator%3A%20Adobe%20Illustrator%2019.1.0%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200)%20%20--%3E%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%20viewBox%3D%220%200%20256%20256%22%20style%3D%22enable-background%3Anew%200%200%20256%20256%3B%22%20xml%3Aspace%3D%22preserve%22%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E.st0%7Bfill%3A%23A6CE39%3B%7D.st1%7Bfill%3A%23FFFFFF%3B%7D%3C%2Fstyle%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M256%2C128c0%2C70.7-57.3%2C128-128%2C128C57.3%2C256%2C0%2C198.7%2C0%2C128C0%2C57.3%2C57.3%2C0%2C128%2C0C198.7%2C0%2C256%2C57.3%2C256%2C128z%22%2F%3E%3Cg%3E%3Cpath%20class%3D%22st1%22%20d%3D%22M86.3%2C186.2H70.9V79.1h15.4v48.4V186.2z%22%2F%3E%3Cpath%20class%3D%22st1%22%20d%3D%22M108.9%2C79.1h41.6c39.6%2C0%2C57%2C28.3%2C57%2C53.6c0%2C27.5-21.5%2C53.6-56.8%2C53.6h-41.8V79.1z%20M124.3%2C172.4h24.5c34.9%2C0%2C42.9-26.5%2C42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z%22%2F%3E%3Cpath%20class%3D%22st1%22%20d%3D%22M88.7%2C56.8c0%2C5.5-4.5%2C10.1-10.1%2C10.1c-5.6%2C0-10.1-4.6-10.1-10.1c0-5.6%2C4.5-10.1%2C10.1-10.1C84.2%2C46.7%2C88.7%2C51.3%2C88.7%2C56.8z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"
									width="16" height="16" />
							</a>
						</li>
					</ul>
				</div>
				<div class="modal-footer">
					<button 
						type="button" 
						class="btn btn-primary" 
						data-bs-toggle="modal"
						data-bs-target="#aboutModal">Close</button>
				</div>
			</div>
		</div>
	</div>
</template>