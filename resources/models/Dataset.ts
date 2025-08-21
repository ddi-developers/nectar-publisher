import { DatasetColumn } from './DatasetColumn.js';

export class Dataset {
  public data: any[][] = [[]];
  public fileName: string | null = null;
  public studyName: string | undefined;
  public studyDescription: string = "Please describe the content and Method of this study.";
  public studyGroupName: string | undefined;
  public studyGroupDescription: string = "Please describe the structure of this study group.";
  public fileSize: number | undefined;
  public mimeType: string;
  public sha256: string | undefined;
  public delimiter: string;
  public linebreak: string | undefined;
  public lastModified: Date | undefined;
  public encoding: string = "utf-8";
  public firstRowIsHeader: boolean = true;
  public errors: any[] = [];
  public columns: DatasetColumn[] = [];
  public uuid: string = window.crypto.randomUUID();
  public instrumentUuid: string = window.crypto.randomUUID();
  public sequenceUuid: string = window.crypto.randomUUID();

  constructor(
    input: string | undefined,
    fileName: string,
    mimeType: string,
    delimiter: string | undefined = undefined,
    firstRowIsHeader: boolean = true
  ) {
    this.fileName = fileName;
    this.mimeType = mimeType;
    this.firstRowIsHeader = firstRowIsHeader;
    if (delimiter === undefined) {
      this.delimiter = ","; //should use the detector
    } else {
      this.delimiter = delimiter;
    }
  }

}