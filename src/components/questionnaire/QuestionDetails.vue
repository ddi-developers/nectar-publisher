<script setup>
const props = defineProps({
	question: { type: Object, required: true },
	index: { type: Number, required: true },
	questionnaire: { type: Object, required: true }
})
defineEmits(['manage-answer-sets'])

function itemList() {
	return props.questionnaire.items.find(o => o.uuid == props.question.itemCodesReference)
}
</script>
<template>
	<div class="col-12">
		<div class="row g-3 details mb-2">
			<div class="col-12">
				<div class="row g-3 details">
					<div class="col-12 col-md-2">
						<label class="form-label">multiple items</label>
						<div class="btn-group" role="group" aria-label="multiple items">
							<input v-model="question.multipleItems" @change="question.createItemList(questionnaire)" type="checkbox"
									class="btn-check" :id="'multipleItems-' + index" autocomplete="off">
							<label class="btn btn-outline-secondary" :for="'multipleItems-' + index">
								<span v-if="!question.multipleItems">☐</span>
								<span v-if="question.multipleItems">☒</span>
							</label>
						</div>
					</div>
					<div class="col-12 col-md-2">
						<label class="form-label">multiple answers</label>
						<div class="btn-group" role="group" aria-label="multiple answers">
							<input v-model="question.multipleAnswers" type="checkbox"
									class="btn-check" :id="'multipleAnswers-' + index" autocomplete="off">
							<label class="btn btn-outline-secondary" :for="'multipleAnswers-' + index">
								<span v-if="!question.multipleAnswers">☐</span>
								<span v-if="question.multipleAnswers">☒</span>
							</label>
						</div>
					</div>
				</div>
			</div>
			<div class="col-12">
				<div class="row g-2 details mb-2">
					<div class="col-12 col-md-2">
						<label :for="'introText-' + index" class="form-label">Question intro text</label>
					</div>
					<div class="col-12 col-md-10">
						<textarea v-model="question.introText" class="form-control" :id="'introText-' + index" rows="2"></textarea>
					</div>
				</div>
			</div>
			<div class="col-12">
				<div class="row g-2 details mb-2">
					<div class="col-12 col-md-2">
						<label :for="'questionText-' + index" class="form-label">Question text</label>
					</div>
					<div class="col-12 col-md-10">
						<textarea v-model="question.questionText" class="form-control" :id="'questionText-' + index" rows="4"></textarea>
					</div>
				</div>
			</div>
			<div class="col-12">
				<div class="row g-2 details mb-2">
					<div class="col-12 col-md-2">
						<label :for="'outroText-' + index" class="form-label">Question outro text</label>
					</div>
					<div class="col-12 col-md-10">
						<textarea v-model="question.outroText" class="form-control" :id="'outroText-' + index" rows="2"></textarea>
					</div>
				</div>
			</div>
			<div v-if="question.answerType == 'coded'" class="col-12">
				<div class="row g-2 details mb-2 align-items-end">
					<div class="col-12 col-md-2">
						<label :for="'answerCodesReference-' + index" class="form-label">Set of answer categories</label>
					</div>
					<div class="col-12 col-md-8">
						<select v-model="question.answerCodesReference" :id="'answerCodesReference-' + index" class="form-select">
							<option v-for="codeList in questionnaire.answers" :value="codeList.uuid">{{ codeList.name }}</option>
						</select>
					</div>
					<div class="col-12 col-md-2">
						<button type="button"
								@click="$emit('manage-answer-sets', question.answerCodesReference ?? '')"
								data-bs-toggle="modal" data-bs-target="#answerSetModal"
								:class="{ 'bg-primary': question.showDetails }"
								class="btn btn-outline-secondary text-white">manage sets
						</button>
					</div>
				</div>
			</div>
			<div v-if="question.multipleItems" class="col-12">
				<div class="row g-2 details mb-2" v-for="codeVal in itemList().codeValues">
					<div class="col-12 col-md-2">
						<input v-model="codeVal.value" type="text" class="form-control" :id="'codeValueVal-' + index + codeVal.value">
					</div>
					<div class="col-12 col-md-10">
						<input v-model="codeVal.label" type="text" class="form-control" :id="'codeValueLab-' + index + codeVal.value">
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<button @click="itemList().addCode()" type="button"
								:class="{ 'bg-primary': question.showDetails }"
								class="btn btn-outline-secondary">add item
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
