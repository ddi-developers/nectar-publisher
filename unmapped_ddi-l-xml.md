# Unmapped fields – DDI Lifecycle 3.3 (XML)

Fields of the *Dataset Information* tab that are **not** written by `src/modules/formatters/ddi-l-xml.ts`,
because the mapping is unclear or needs objects the export does not create yet.

| Field | Possible target | Why it is not mapped |
|---|---|---|
| Further titles of type `TranslatedTitle` / `Other` | `r:Citation/r:AlternateTitle` (with `xml:lang` for translations) | The language of a translated title is not captured; `Other` has no clear target. Only `Subtitle` → `r:SubTitle` and `AlternativeTitle` → `r:AlternateTitle` are mapped. |
| Availability | `a:Archive/a:ArchiveSpecific/a:Access` or `r:Embargo` | Requires an Archive module (and organization) or a decision on how the availability terms map to access conditions/embargo. |
| Funders | `r:FundingInformation/r:AgencyOrganizationReference` | Needs an `a:Organization` in an `a:OrganizationScheme`; only a free-text name is captured. |
| Geographic coverage – region | `r:Coverage/r:SpatialCoverage/r:Description` or a `r:GeographicLocation` | Unclear whether free text in the description is sufficient or a geographic location should be modelled. |
| Universe | `c:Universe` in a `c:UniverseScheme`, referenced by `r:UniverseReference` | Needs a ConceptualComponent / UniverseScheme, which the export does not create yet. |
| Date format of collection period | – | Only describes the input; the dates are written as entered (`r:StartDate`/`r:EndDate`/`r:SimpleDate` accept `yyyy`, `yyyy-mm`, `yyyy-mm-dd`). |
| Publications (citation, ID) | `r:OtherMaterial` with `r:Citation` / `r:ExternalURLReference`, or `r:RelatedOtherMaterialReference` | Type of relationship and the place of the OtherMaterial (scheme vs. inline) are unclear. |
| Notes on project/data | `r:Note` or `r:Purpose` | `r:Note` needs a type/relationship, `r:Purpose` has a different meaning. |
| Study group name / description | `g:Group` | Not part of this extension; still unmapped as before. |

## Mapping assumptions worth reviewing

- **Principal investigators** → `r:Citation/r:Creator/r:CreatorName`, institution as `@affiliation`.
- **Topic keywords** → `r:TopicalCoverage/r:Keyword` without vocabulary attributes;
  **TheSoz keywords** → `r:Keyword` with `@controlledVocabularyName="TheSoz"`.
- **Modes of collection** are entered once per study, but in DDI they belong to a `d:CollectionEvent`.
  They are written into *every* collection event (one event per collection period; one event without date if no period is given).
- A collection period with only a start or only an end is written as `r:SimpleDate`.
- Time method, sampling procedure, mode of collection and contributor role get the DDI CV attributes
  (`controlledVocabularyID`, `…AgencyName`, `…VersionID`) only if the value is a term of the vocabulary;
  free-text values are written without them.

---

# Variables tab

| Field | Status | Possible DDI-L 3.3 target / remark |
|---|---|---|
| Name, Label, Description | mapped | `l:VariableName`, `r:Label`, `r:Description` |
| Type | mapped | `l:VariableRepresentation` (`r:NumericRepresentation` / `r:TextRepresentation` / `r:DateTimeRepresentation` / `r:CodeRepresentation`) |
| Coded + code list (code, name) | mapped | `l:CodeList` + `l:CategoryScheme` (see the validation errors above) |
| Code frequency | **not mapped** | No place in the logical metadata; would go into `pi:Statistics` / `pi:CategoryStatistic` of the `PhysicalInstance` (not generated yet). |
| Role (Identifier / Measure / Attribute) | **not mapped** | `l:VariableRepresentation/l:VariableRole` exists (`CodeValueType`), but DDI 3.3 has no controlled vocabulary for these terms (they come from DDI-CDI). Identifiers could also go into `l:RecordLayout`/`p:DataItem` or `l:VariableScheme` grouping – unclear. |
| Question Reference | **not mapped** | `l:Variable/r:QuestionReference` (exists in the schema, after `r:ConceptReference`). Not added yet; `TypeOfObject` would have to follow the same QuestionItem/QuestionGrid logic as the question export. |
| Unit | **not mapped** | `r:NumericRepresentation/r:MeasurementUnit` (`CodeValueType`, no DDI vocabulary). Note: `unit` is not declared in `DatasetColumn.ts`, the form writes it ad hoc. |
| Decimal positions | **not mapped** | `r:NumericRepresentation/@decimalPositions`. Not declared in `DatasetColumn.ts`. |
| Accuracy | **not mapped** | Unclear what it means (precision? scale? measurement error?). `@scale` on `NumericRepresentation` or a `r:Description` note are candidates. Not declared in `DatasetColumn.ts`. |

# Associated questionnaire tab

| Field | Status | Possible DDI-L 3.3 target / remark |
|---|---|---|
| Question text | mapped | `d:QuestionText/d:LiteralText/d:Text` |
| Type | mapped | `d:NumericDomain` / `d:DateTimeDomain` / `d:TextDomain` / `d:CodeDomain` |
| Set of answer categories | mapped | `d:CodeDomain/r:CodeListReference` |
| Answer sets: codes and names | mapped | `l:CodeList` + `l:CategoryScheme` per set |
| multiple items + item list | mapped, **bug** | Produces `d:QuestionGrid` with a `d:GridDimension`, but the dimension's `r:CodeListReference` uses `answerCodesReference` instead of `itemCodesReference`, so the item code list is written but never referenced. |
| multiple answers | partly, **inconsistent** | Only changes `r:TypeOfObject` of the `r:QuestionReference` to `QuestionGrid`, while the referenced element is still a `d:QuestionItem` when "multiple items" is off. A multiple-response question would rather be a `d:CodeDomain` with `r:ResponseCardinality maximumResponses="…"`. |
| Nr | **not mapped** | Order is given by the `d:Sequence`; the number itself could be `r:UserID` (typed, e.g. `typeOfUserID="QuestionNumber"`) or `d:ConstructName` – no convention decided. |
| Question Name | **not mapped** | `d:QuestionItemName` / `d:QuestionGridName` (and/or `d:ConstructName` on the `QuestionConstruct`). |
| Question intro text | **not mapped** | Either a separate `d:StatementItem` before the question in the `d:Sequence`, or an `d:Instruction` – unclear which is wanted. |
| Question outro text | **not mapped** | Same as intro text (`d:StatementItem` after the question, or instruction). |
| Answer set name | **not mapped** | `l:CodeListName/r:String` (and `l:CategorySchemeName`). |
| Answer set description | **not mapped** | `r:Description` of the `l:CodeList`. |
| Item list names (labels) | mapped | as `l:Category` labels |
| Interviewer / respondent / programming instructions | model only | The model has them and the export writes them (all as `d:InterviewerInstruction`, see above), but there is no input field in the tab. |
