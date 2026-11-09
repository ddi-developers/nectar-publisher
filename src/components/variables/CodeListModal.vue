<script setup>
defineProps({
	column: { type: Object, default: null }
})
</script>
<template>
	<div class="modal fade" id="codeListModal" tabindex="-1" aria-labelledby="codeListModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-scrollable">
			<div v-if="column != null" class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="codeListModalLabel">📦Code list <span v-html="column.name" class="badge bg-secondary"></span></h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form class="mb-4">
						<div class="row g-2" v-for="code in column.codeValues">
							<div class="col-12 col-md-4">
								<label class="form-label">Code</label>
								<input v-model="code.value" type="text" class="form-control" disabled>
							</div>
							<div class="col-12 col-md-8">
								<label class="form-label">Name</label>
								<input v-model="code.label" type="text" class="form-control">
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
</template>
