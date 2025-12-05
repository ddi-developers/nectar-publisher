import { DatasetColumn } from './DatasetColumn.js';

// Helper function for UUID generation, that works in both browser and Node.js
function getRandomUUID(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
}

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
  public uuid: string = getRandomUUID();
  public instrumentUuid: string = getRandomUUID();
  public sequenceUuid: string = getRandomUUID();

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
    if (!delimiter) {
      this.delimiter = ","; //should use the detector
    } else {
      this.delimiter = delimiter;
    }
  }

}
