<script setup>
import QuestionDetails from './QuestionDetails.vue'

defineProps({
	question: { type: Object, required: true },
	index: { type: Number, required: true },
	questionnaire: { type: Object, required: true }
})
defineEmits(['delete', 'manage-answer-sets'])
</script>
<template>
	<form class="row g-2 g-md-1 align-items-end align-items-md-center border rounded p-2 p-md-1" :class="{ 'bg-light': question.showDetails }">
		<div class="col-auto shrink">
			<span>{{ index }}</span>
		</div>
		<div class="col-12 col-md-2">
			<label class="form-label editor-field-label">Nr</label>
			<input v-model="question.questionNr" type="text" class="form-control">
		</div>
		<div class="col-12 col-md">
			<label class="form-label editor-field-label">Question Name</label>
			<input v-model="question.questionName" type="text" class="form-control">
		</div>
		<div class="col-12 col-md-auto editor-type-column">
			<label class="form-label editor-field-label">Type</label>
			<div class="input-group">
				<select v-model="question.answerType" class="form-select">
					<option>coded</option>
					<option>numeric</option>
					<option>date/time</option>
					<option>text</option>
				</select>
			</div>
		</div>
		<div class="col-6 col-md-auto">
			<label class="form-label editor-field-label">Details</label>
			<button @click="question.showDetails = !question.showDetails" type="button"
					:class="{ 'bg-primary': question.showDetails }"
					class="btn btn-outline-secondary">⚙️
			</button>
		</div>
		<div class="col-6 col-md-auto">
			<label class="form-label editor-field-label">Delete</label>
			<button @click="$emit('delete')" type="button"
					:class="{ 'bg-primary': question.delete }"
					class="btn btn-outline-secondary">🗑
			</button>
		</div>

		<Transition>
			<QuestionDetails
				v-if="question.showDetails"
				:question="question"
				:index="index"
				:questionnaire="questionnaire"
				@manage-answer-sets="$emit('manage-answer-sets', $event)" />
		</Transition>
	</form>
</template>
