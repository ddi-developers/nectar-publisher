export interface CodeValueInit {
  value: any;
  label?: string;
  frequency?: number | string | null;
  isMissingValue?: boolean;
  uuid?: string;
  categoryUuid?: string;
}

export class CodeValue {
  public value: any;
  public frequency: number | string | null;
  public label: string | undefined;
  public isMissingValue: boolean;
  public uuid: string;
  public categoryUuid: string;

  constructor({
    value,
    label,
    frequency = null,
    isMissingValue = false,
    uuid = window.crypto.randomUUID(),
    categoryUuid = window.crypto.randomUUID(),
  }: CodeValueInit) {
    this.uuid = uuid;
    this.categoryUuid = categoryUuid;
    this.value = value;
    this.label = label;
    this.frequency = frequency;
    this.isMissingValue = isMissingValue;
  }
}
