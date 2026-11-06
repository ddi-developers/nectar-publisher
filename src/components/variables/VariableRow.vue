<script setup>
import { RepresentationTypes } from '../../modules/utils.js'
import VariableDetails from './VariableDetails.vue'

defineProps({
	column: { type: Object, required: true },
	index: { type: Number, required: true },
	questions: { type: Array, required: true }
})
defineEmits(['edit-codelist'])
</script>
<template>
	<form class="row g-2 g-md-1 align-items-end align-items-md-center border rounded p-2 p-md-1" :class="{ 'bg-light': column.showDetails }">
		<div class="col-auto shrink">
			<span>{{ column.position }}</span>
		</div>
		<div class="col-12 col-md-2">
			<label class="form-label editor-field-label">Name</label>
			<input v-model="column.name" type="text" class="form-control" disabled readonly>
		</div>
		<div class="col-12 col-md">
			<label class="form-label editor-field-label">Label</label>
			<input v-model="column.label" type="text" class="form-control">
		</div>
		<div class="col-12 col-md-auto editor-type-column">
			<label class="form-label editor-field-label">Type</label>
			<div class="input-group">
				<select v-model="column.hasIntendedDataType" class="form-select">
					<option v-for="colType in RepresentationTypes" :value="colType">{{ colType.label }}</option>
				</select>
				<Transition>
					<button v-if="column.hasIntendedDataType?.id == 'Code'" class="btn btn-outline-secondary" type="button" title="document codelist">🧾</button>
				</Transition>
			</div>
		</div>
		<div class="col-6 col-md-auto variable-coded-column">
			<label class="form-label editor-field-label">Coded</label>
			<div class="btn-group" role="group" aria-label="coded variable">
				<input v-model="column.coded" @change="column.createCodeList()" type="checkbox"
						class="btn-check" :id="'coded-' + column.id" autocomplete="off">
				<label class="btn btn-outline-secondary" :for="'coded-' + column.id">
					<span v-if="!column.coded">☐</span>
					<span v-if="column.coded">☒</span>
				</label>
				<button v-if="column.coded" @click="$emit('edit-codelist')"
						data-bs-toggle="modal" data-bs-target="#codeListModal" type="button"
						class="btn btn-outline-secondary">✏️
				</button>
			</div>
		</div>
		<div class="col-6 col-md-auto variable-details-column">
			<label class="form-label editor-field-label">Details</label>
			<button @click="column.showDetails = !column.showDetails" type="button"
					:class="{ 'bg-primary': column.showDetails }"
					class="btn btn-outline-secondary">⚙️
			</button>
		</div>

		<Transition>
			<VariableDetails v-if="column.showDetails" :column="column" :index="index" :questions="questions" />
		</Transition>
	</form>
</template>
