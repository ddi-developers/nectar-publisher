<script setup>
import QuestionRow from './QuestionRow.vue'

defineProps({
	questionnaire: { type: Object, required: true }
})
defineEmits(['manage-answer-sets'])

</script>
<template>
	<section id="questions">
		<div class="row g-2 g-md-1 align-items-end px-2 pb-2 editor-header d-none d-md-flex" aria-hidden="true">
			<div class="col-auto shrink"><span class="invisible">0</span></div>
			<div class="col-12 col-md-2"><span class="form-label mb-0">Nr</span></div>
			<div class="col-12 col-md"><span class="form-label mb-0">Question Name</span></div>
			<div class="col-12 col-md-auto editor-type-column"><span class="form-label mb-0">Type</span></div>
			<div class="col-6 col-md-auto"><span class="form-label mb-0">Details</span></div>
			<div class="col-6 col-md-auto"><span class="form-label mb-0">Delete</span></div>
		</div>
		<div class="d-flex flex-column gap-2 gap-md-1">
			<QuestionRow
				v-for="(question, index) in questionnaire.questions"
				:key="question.uuid"
				:question="question"
				:index="index"
				:questionnaire="questionnaire"
				@delete="questionnaire.questions = questionnaire.questions.filter(q => q.uuid !== question.uuid)"
				@manage-answer-sets="$emit('manage-answer-sets', $event)" />
			<button @click="questionnaire.addQuestion()" type="button"
					class="btn btn-outline-secondary">➕ add question
			</button>
		</div>
	</section>
</template>
