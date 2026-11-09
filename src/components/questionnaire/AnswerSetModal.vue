<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
	questionnaire: { type: Object, required: true }
})
const uuid = defineModel('uuid', { type: String, default: '' })

const newValue = ref('')
const newLabel = ref('')
const selectedAnswerSet = computed(() => props.questionnaire.answers.find(a => a.uuid == uuid.value))

function addCode() {
	if (!selectedAnswerSet.value) return
	selectedAnswerSet.value.addCode(newValue.value, newLabel.value)
	newValue.value = ''
	newLabel.value = ''
}

function addSet() {
	uuid.value = props.questionnaire.addAnswerSet().uuid
}
</script>
<template>
	<div class="modal fade" id="answerSetModal" tabindex="-1" aria-labelledby="answerSetModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="answerSetModalLabel">📦Sets of answer categories</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form class="mb-4" @submit.prevent>
						<div class="mb-3">
							<label for="answerSetSelect" class="form-label">Set</label>
							<select v-model="uuid" id="answerSetSelect" class="form-select">
								<option v-for="codeList in questionnaire.answers" :value="codeList.uuid">{{ codeList.name }}</option>
							</select>
						</div>
						<div v-if="selectedAnswerSet" class="mb-3">
							<label for="answerSetName" class="form-label">Set name</label>
							<input v-model="selectedAnswerSet.name" id="answerSetName" type="text" class="form-control">
						</div>
						<div v-if="selectedAnswerSet" class="mb-3">
							<label for="answerSetDescription" class="form-label">Set description</label>
							<textarea v-model="selectedAnswerSet.description" id="answerSetDescription" class="form-control" rows="3"></textarea>
						</div>
						<template v-if="selectedAnswerSet">
							<div class="row g-2" v-for="code in selectedAnswerSet.codeValues">
								<div class="col-12 col-md-4">
									<label class="form-label">Code</label>
									<input v-model="code.value" type="text" class="form-control">
								</div>
								<div class="col-12 col-md-8">
									<label class="form-label">Name</label>
									<input v-model="code.label" type="text" class="form-control">
								</div>
							</div>
							<hr />
							<div class="row g-2">
								<div class="col-12 col-md-4">
									<label for="answerSetNewValue" class="form-label">New code</label>
									<input v-model="newValue" id="answerSetNewValue" type="text" class="form-control">
								</div>
								<div class="col-12 col-md-8">
									<label for="answerSetNewLabel" class="form-label">New name</label>
									<input v-model="newLabel" id="answerSetNewLabel" type="text" class="form-control">
								</div>
							</div>
						</template>
					</form>
				</div>
				<div class="modal-footer">
					<button @click="addCode()" :disabled="!selectedAnswerSet" type="button" class="btn btn-outline-secondary">➕ add code to set</button>
					<button @click="addSet()" type="button" class="btn btn-outline-secondary">➕ add new set</button>
					<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
</template>
