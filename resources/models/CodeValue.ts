export class CodeValue {
  public value: any;
  public frequency: number | null;
  public label: string | null;
  public isMissingValue: boolean | null;
  public uuid: string = window.crypto.randomUUID();
  public categoryUuid: string = window.crypto.randomUUID();

  constructor(value: any, label: string | null, frequency: number | null = null, isMissingValue: boolean | null = null) {
    this.value = value;
    this.frequency = frequency;
    this.label = label;
    this.isMissingValue = isMissingValue;
  }
}
