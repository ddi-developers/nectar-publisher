import { CodeValue, type CodeValueInit } from './CodeValue.ts';

export type AnswerType = 'coded' | 'numeric' | 'date/time' | 'text';

export interface InstructionInit {
  uuid?: string;
  instructionText?: string;
}

export class Instruction {
  public uuid: string;
  public instructionText: string | undefined;

  constructor({ uuid = window.crypto.randomUUID(), instructionText }: InstructionInit) {
    this.uuid = uuid;
    this.instructionText = instructionText;
  }
}

export interface QuestionInit {
  uuid?: string;
  constructUuid?: string;
  answerType?: AnswerType;
  multipleItems?: boolean;
  multipleAnswers?: boolean;
  basedOnReference?: string;
  questionNr?: string;
  questionName?: string;
  concept?: string;
  introText?: string;
  questionText?: string;
  outroText?: string;
  interviewerInstructionReference?: string | null;
  respondentInstructionReference?: string | null;
  programmingInstructionReference?: string | null;
  answerLabel?: string;
  itemCodesReference?: string;
  answerCodesReference?: string;
}

export class Question {
  public uuid: string;
  public constructUuid: string;
  public answerType: AnswerType | undefined;
  public multipleItems: boolean | undefined;
  public multipleAnswers: boolean | undefined;
  public basedOnReference: string | undefined;
  public questionNr: string | undefined;
  public questionName: string | undefined;
  public concept: string | undefined;
  public introText: string | undefined;
  public questionText: string | undefined;
  public outroText: string | undefined;
  public interviewerInstructionReference: string | null | undefined;
  public respondentInstructionReference: string | null | undefined;
  public programmingInstructionReference: string | null | undefined;
  public answerLabel: string | undefined;
  public itemCodesReference: string | undefined;
  public answerCodesReference: string | undefined;
  public showDetails: boolean = false;

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
  }: QuestionInit) {
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

  createItemList(questionnaire: Questionnaire): void {
    if (!this.multipleItems) {
      questionnaire.items = questionnaire.items.filter((e) => e.uuid !== this.itemCodesReference);
      this.itemCodesReference = "";
    } else {
      const codeList = new CodeList({ name: "Items", codeValues: [{ value: "A", label: "" }] });
      questionnaire.items.push(codeList);
      this.itemCodesReference = codeList.uuid;
    }
  }
}

export interface CodeListInit {
  uuid?: string;
  categorySchemeUuid?: string;
  name?: string;
  description?: string;
  codeValues?: CodeValueInit[];
}

export class CodeList {
  public uuid: string;
  public categorySchemeUuid: string;
  public name: string | undefined;
  public description: string | undefined;
  public codeValues: CodeValue[];

  constructor({
    uuid = window.crypto.randomUUID(),
    categorySchemeUuid = window.crypto.randomUUID(),
    name,
    description,
    codeValues = [],
  }: CodeListInit) {
    this.uuid = uuid;
    this.categorySchemeUuid = categorySchemeUuid;
    this.name = name;
    this.description = description;
    this.codeValues = codeValues.map((cv) => new CodeValue(cv));
  }

  addCode(): void {
    this.codeValues.push(new CodeValue({ value: "", label: "" }));
  }
}

export interface QuestionnaireInit {
  uuid?: string;
  sequenceUuid?: string;
  intervInstrSchemeUuid?: string;
  respInstrSchemeUuid?: string;
  progInstrSchemeUuid?: string;
  questionSchemeUuid?: string;
  interviewerInstructions?: InstructionInit[];
  respondentInstructions?: InstructionInit[];
  programmingInstructions?: InstructionInit[];
  questions?: QuestionInit[];
  items?: CodeListInit[];
  answers?: CodeListInit[];
}

export class Questionnaire {
  public uuid: string;
  public sequenceUuid: string;
  public intervInstrSchemeUuid: string | undefined;
  public respInstrSchemeUuid: string | undefined;
  public progInstrSchemeUuid: string | undefined;
  public questionSchemeUuid: string | undefined;
  public interviewerInstructions: Instruction[];
  public respondentInstructions: Instruction[];
  public programmingInstructions: Instruction[];
  public questions: Question[];
  public items: CodeList[];
  public answers: CodeList[];

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
  }: QuestionnaireInit) {
    this.uuid = uuid;
    this.sequenceUuid = sequenceUuid;
    this.intervInstrSchemeUuid = intervInstrSchemeUuid;
    this.respInstrSchemeUuid = respInstrSchemeUuid;
    this.progInstrSchemeUuid = progInstrSchemeUuid;
    this.questionSchemeUuid = questionSchemeUuid;
    this.interviewerInstructions = interviewerInstructions.map((ii) => new Instruction(ii));
    this.respondentInstructions = respondentInstructions.map((ri) => new Instruction(ri));
    this.programmingInstructions = programmingInstructions.map((pi) => new Instruction(pi));
    this.questions = questions.map((q) => new Question(q));
    this.items = items.map((i) => new CodeList(i));
    this.answers = answers.map((a) => new CodeList(a));
  }
}
