# Unmapped fields – DDI Lifecycle 4.0 (JSON)

**None** of the fields of the *Dataset Information* tab are written by `src/modules/formatters/ddi-40-l-json.ts` yet.

## Why

- The export currently has no `StudyUnit` at all; it starts at `PhysicalInstance` (also listed as `topLevelReference`).
  The study level metadata would have to go into a new `StudyUnit` item that references the `PhysicalInstance`.
- The JSON serialization of the 4.0 model could not be verified: no JSON schema is available locally, and the
  online model documentation ([StudyUnit](https://docs.ddialliance.org/DDI-Lifecycle/dev/model/item-types/StudyUnit/))
  lists `Abstract`, `Purpose` etc. as `langString`, while the existing export writes strings as
  `{ "MultilingualStringValue": { "Value", "LanguageTag" } }` (older beta shape). The shape of `CitationType`,
  `CoverageType` and `langString` in the current JSON schema (`jsonSchema.json` in the
  [ddimodel releases](https://github.com/ddialliance/ddimodel/releases)) should be checked first.

## Likely targets (same structure as DDI-L 3.3, see `unmapped_ddi-l-xml.md`)

| Field | 4.0 target (from the model documentation) |
|---|---|
| Study name, further titles, principal investigators, publishers, contributors, publication year | `StudyUnit.Citation` (`CitationType`: Title, SubTitle, AlternateTitle, Creator, Publisher, Contributor, PublicationDate) |
| Study description | `StudyUnit.Abstract` (`langString`) |
| Subjects, topic keywords, TheSoz keywords, countries | `StudyUnit.Coverage` (`CoverageType`: TopicalCoverage, SpatialCoverage) |
| Universe | `StudyUnit.UniverseReference` → `Universe` item |
| Funders | `StudyUnit.FundingInformation` (needs an `Organization` reference) |
| Availability | `StudyUnit.Embargo` / `ArchiveReference` (unclear) |
| Time dimension, sampling procedure | `DataCollection` → `Methodology` (`TimeMethod`, `SamplingProcedure`) |
| Modes of collection, collection periods | `DataCollection.CollectionEvent` (`ModeOfCollection`, `DataCollectionDate`) |
| Publications | `RelatedOtherMaterialReference` → `OtherMaterial` (unclear) |
| Notes on project/data | `Note` (inherited from Maintainable, unclear) |
| Region, date format of collection period, study group | see `unmapped_ddi-l-xml.md` |

---

# Variables tab

| Field | Status | Remark |
|---|---|---|
| Name, Label, Description | mapped | `VariableName`, `Label`, `Description` (`MultilingualStringValue`, see shape problem above) |
| Type | mapped | `VariableRepresentation` (`CodeRepresentation` / `NumericRepresentation` / `TextRepresentation` / `DateTimeRepresentation`) |
| Coded + code list | partly, **dangling** | Only a `CodeListReference` is written; the `CodeList` and its codes/categories are not exported, so the reference points to nothing. |
| Code frequency | **not mapped** | Statistics on the physical instance – unclear in 4.0. |
| Role | **not mapped** | `VariableRole` (as in 3.3) – not verified. |
| Question Reference | **not mapped** | `QuestionReference` on `Variable` (as in 3.3) – not verified, and no question is exported. |
| Unit / Decimal positions / Accuracy | **not mapped** | `MeasurementUnit`, `decimalPositions` (as in 3.3) – not verified; accuracy unclear. |

# Associated questionnaire tab

**Nothing** is written (no `Sequence`, `QuestionItem`, `QuestionGrid`, `CodeList` or instructions). The
DDI-L 3.3 export (`ddi-l-xml.ts`) already maps most of it and could serve as the template once the 4.0 JSON
shape is verified. See `unmapped_ddi-l-xml.md` for the field list.
