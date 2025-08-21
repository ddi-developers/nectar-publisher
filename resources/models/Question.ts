export class Question {
  public preQuestionText: string | undefined;
  public questionText: string | undefined;
  public postQuestionText: string | undefined;
  public interviewerInstructions: string | undefined;
  public uuid: string = window.crypto.randomUUID();
}
