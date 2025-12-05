export class CodeValue {
  public value: any;
  public frequency: number | undefined;
  public label: string | undefined;
  public isMissingValue: boolean | undefined;
  public uuid: string = window.crypto.randomUUID();
  public categoryUuid: string = window.crypto.randomUUID();

  constructor(value: any, label?: string, frequency?: number, isMissingValue?: boolean) {
    this.value = value;
    this.frequency = frequency;
    this.label = label;
    this.isMissingValue = isMissingValue;
  }
}
