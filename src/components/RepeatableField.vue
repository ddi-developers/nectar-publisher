<script setup>
// Renders a list of strings as a repeatable input (or select box, if options are given and select is set)
const props = defineProps({
	id: String,
	list: Array,
	options: Array,
	select: Boolean,
	placeholder: String
})
</script>
<template>
	<div class="input-group mb-1" v-for="(entry, index) in props.list">
		<select v-if="props.select" v-model="props.list[index]" :id="props.id + '-' + index" class="form-select">
			<option v-for="option in props.options" :value="option">{{ option }}</option>
		</select>
		<input v-else v-model="props.list[index]" :id="props.id + '-' + index" :list="props.options ? props.id + '-options' : null"
			   :placeholder="props.placeholder" type="text" class="form-control">
		<button @click="props.list.splice(index, 1)" type="button" class="btn btn-outline-secondary" title="remove entry">🗑</button>
	</div>
	<datalist v-if="props.options && !props.select" :id="props.id + '-options'">
		<option v-for="option in props.options" :value="option"></option>
	</datalist>
	<button @click="props.list.push('')" type="button" class="btn btn-outline-secondary btn-sm" title="add entry">➕</button>
</template>
