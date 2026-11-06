<script setup>
defineProps({
	column: { type: Object, required: true },
	index: { type: Number, required: true },
	questions: { type: Array, required: true }
})
</script>
<template>
	<div class="col-12">
		<div class="row g-3 details">
			<div class="col-12">
				<label :for="'description-' + column.position" class="form-label">Description</label>
				<textarea v-model="column.description" class="form-control" :id="'description-' + column.position" rows="4"></textarea>
			</div>
			<div v-if="column.hasIntendedDataType.type == 'numeric' || column.hasIntendedDataType.type == 'decimal'" class="col-12">
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
			<div v-if="column.hasIntendedDataType.type == 'decimal'" class="col-12 col-md-6">
				<label class="form-label">Decimal positions</label>
				<input v-model.number="column.decimalPositions" type="number" inputmode="numeric" pattern="[0-9]" step="1" min="0" class="form-control">
			</div>
			<div v-if="column.hasIntendedDataType.type == 'numeric' || column.hasIntendedDataType.type == 'decimal'" class="col-12 col-md-4">
				<label class="form-label">Accuracy</label>
				<input v-model.number="column.accuracy" type="number" inputmode="numeric" pattern="[0-9]" step="1" min="0" class="form-control">
			</div>
			<div class="col-12 col-md-4">
				<label class="form-label">Role</label>
				<select v-model="column.role" name="role" id="role" class="form-select">
					<option name="Identifier">Identifier</option>
					<option name="Measure">Measure</option>
					<option name="Attribute">Attribute</option>
				</select>
			</div>
			<div class="col-12 col-md-4">
				<label :for="'questionReference-' + index" class="form-label">Question Reference</label>
				<select v-model="column.questionReference" :id="'questionReference-' + index" class="form-select">
					<option v-for="question in questions" :value="question.uuid">{{ question.questionName }}</option>
				</select>
			</div>
		</div>
	</div>
</template>
