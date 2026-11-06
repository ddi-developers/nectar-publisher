<script setup>
import VariableRow from './VariableRow.vue'

defineProps({
	columns: { type: Array, required: true },
	questions: { type: Array, required: true }
})
defineEmits(['edit-codelist'])
</script>
<template>
	<section id="variables">
		<div class="row g-2 g-md-1 align-items-end px-2 pb-2 editor-header d-none d-md-flex" aria-hidden="true">
			<div class="col-auto shrink"><span class="invisible">0</span></div>
			<div class="col-12 col-md-2"><span class="form-label mb-0">Name</span></div>
			<div class="col-12 col-md"><span class="form-label mb-0">Label</span></div>
			<div class="col-12 col-md-auto editor-type-column"><span class="form-label mb-0">Type</span></div>
			<div class="col-6 col-md-auto variable-coded-column"><span class="form-label mb-0">Coded</span></div>
			<div class="col-6 col-md-auto variable-details-column"><span class="form-label mb-0">Details</span></div>
		</div>
		<div class="d-flex flex-column gap-2 gap-md-1">
			<VariableRow
				v-for="(column, index) in columns"
				:column="column"
				:index="index"
				:questions="questions"
				@edit-codelist="$emit('edit-codelist', index)" />
		</div>
	</section>
</template>
