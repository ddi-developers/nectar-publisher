class Instruction {
    constructor({ uuid = window.crypto.randomUUID(), instructionText }) {
        this.uuid = uuid;
        this.instructionText = instructionText;
    }
}

class Question {
    constructor({
        uuid = window.crypto.randomUUID(),
        constructUuid = window.crypto.randomUUID(),
        answerType,
        multipleItems,
        multipleAnswers,
        basedOnReference,
        questionNr,
        questionName,
        concept,
        introText,
        questionText,
        outroText,
        interviewerInstructionReference,
        respondentInstructionReference,
        programmingInstructionReference,
        answerLabel,
        itemCodesReference,
        answerCodesReference,
    }) {
        this.uuid = uuid;
        this.constructUuid = constructUuid;
        this.answerType = answerType;
        this.multipleItems = multipleItems;
        this.multipleAnswers = multipleAnswers;
        this.basedOnReference = basedOnReference;
        this.questionNr = questionNr;
        this.questionName = questionName;
        this.concept = concept;
        this.introText = introText;
        this.questionText = questionText;
        this.outroText = outroText;
        this.interviewerInstructionReference = interviewerInstructionReference;
        this.respondentInstructionReference = respondentInstructionReference;
        this.programmingInstructionReference = programmingInstructionReference;
        this.answerLabel = answerLabel;
        this.itemCodesReference = itemCodesReference;
        this.answerCodesReference = answerCodesReference;
    }
    createItemList(questionnaire){
      if(!this.multipleItems){
        questionnaire.items = input.dataset.associatedQuestionnaire.items.filter(e => e.uuid !== this.itemCodesReference)
        this.itemCodesReference = "";
      }
      else {
        var codeList = new CodeList({"name": "Items", "codeValues": [{"value": "A","label": ""}]})
        questionnaire.items.push(codeList);
        this.itemCodesReference = codeList.uuid;
      }
    }
}

class CodeValue {
    constructor({ value, label, frequency = null, isMissingValue = false, uuid = window.crypto.randomUUID(), categoryUuid = window.crypto.randomUUID() }) {
        this.uuid = uuid;
        this.categoryUuid = categoryUuid;
        this.value = value;
        this.label = label;
        this.frequency = frequency;
        this.isMissingValue = isMissingValue;
    }
}

class CodeList {
    constructor({ uuid = window.crypto.randomUUID(), categorySchemeUuid = window.crypto.randomUUID(), name, description, codeValues = [] }) {
        this.uuid = uuid;
        this.categorySchemeUuid = categorySchemeUuid;
        this.name = name;
        this.description = description;
        this.codeValues = codeValues.map(cv => new CodeValue(cv));
    }
    addCode() {
        var codeValue = new CodeValue({ "value": "", "label": "", "frequency": null, "isMissingValue": false, "uuid": window.crypto.randomUUID(), "categoryUuid": window.crypto.randomUUID() });
        this.codeValues.push(codeValue);
    }
}

class Questionnaire {
    constructor({
        uuid = window.crypto.randomUUID(),
        sequenceUuid = window.crypto.randomUUID(),
        intervInstrSchemeUuid,
        respInstrSchemeUuid,
        progInstrSchemeUuid,
        questionSchemeUuid,
        interviewerInstructions = [],
        respondentInstructions = [],
        programmingInstructions = [],
        questions = [],
        items = [],
        answers = [],
    }) {
        this.uuid = uuid;
        this.sequenceUuid = sequenceUuid;
        this.intervInstrSchemeUuid = intervInstrSchemeUuid;
        this.respInstrSchemeUuid = respInstrSchemeUuid;
        this.progInstrSchemeUuid = progInstrSchemeUuid;
        this.questionSchemeUuid = questionSchemeUuid;
        this.interviewerInstructions = interviewerInstructions.map(ii => new Instruction(ii));
        this.respondentInstructions = respondentInstructions.map(ri => new Instruction(ri));
        this.programmingInstructions = programmingInstructions.map(pi => new Instruction(pi));
        this.questions = questions.map(q => new Question(q));
        this.items = items.map(i => new CodeList(i));
        this.answers = answers.map(a => new CodeList(a));
    }
}
