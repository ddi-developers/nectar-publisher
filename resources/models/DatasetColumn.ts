import { Question } from './Question.ts';
import { VarFormat } from './VarFormat.ts';
import { CodeValue } from './CodeValue.ts';

export class DatasetColumn {
  public position: number | undefined;
  public id: string;
  public name: string;
  public label: string | undefined;
  public description: string | undefined;
  public role: string | undefined;
  public values: any[] = [];
  public codeValues: CodeValue[] = [];
  public coded: boolean = false;
  public varFormat: VarFormat;
  public responseUnit: string | undefined;
  public valuesUnique: any[] = [];
  public hasIntendedDataType: { id: string, label: string, type: string } | undefined;
  public dataType: string = "text";
  public question: Question;
  public minValue: number | undefined;
  public maxValue: number | undefined;
  public uuid: string = window.crypto.randomUUID();
  public codeListUuid: string = window.crypto.randomUUID();
  public categorySchemeUuid: string = window.crypto.randomUUID();
  public agency?: string;
  public version?: string;

  constructor(id: string) {
    this.id = id;
    this.name = id;
    this.question = new Question();
    this.varFormat = new VarFormat();
  }

  public getConceptScheme() {
    const conceptScheme: {
      "@id": string;
      "@type": string;
      "skos:hasTopConcept": string[];
    } = {
      "@id": "#conceptScheme-" + this.uuid,
      "@type": "skos:ConceptScheme",
      "skos:hasTopConcept": [],
    };
    for (const v of this.getUniqueValues()) {
      conceptScheme["skos:hasTopConcept"].push("#" + this.id + "-concept-" + v);
    }
    return conceptScheme;
  }

  public getUniqueValues(): any[] {
    return [...new Set(this.values)];
  }

  public createCodeList(): void {
    if (!this.coded) {
      this.codeValues = [];
      return;
    }
    for (const v of this.valuesUnique) {
      this.codeValues.push(
        new CodeValue(v, undefined, this.values.filter((e) => e === v).length)
      );
    }
  }
}
