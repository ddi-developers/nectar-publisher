# Unmapped fields – DDI Codebook 2.5 (XML)

Fields of the *Dataset Information* tab that are **not** written by `src/modules/formatters/ddi-c-xml.ts`,
because the mapping is unclear.

| Field | Possible target | Why it is not mapped |
|---|---|---|
| Further titles of type `Other` | `titlStmt/altTitl` | No clear target. `Subtitle` → `subTitl`, `AlternativeTitle` → `altTitl`, `TranslatedTitle` → `parTitl` are mapped. |
| Publishers | `citation/prodStmt/producer` or `citation/distStmt/distrbtr` | Unclear whether the publisher is the producer or the distributor of the data. |
| Publication year | `citation/distStmt/distDate` or `citation/prodStmt/prodDate` | Depends on the publisher decision above. |
| Publication ID (of a related publication) | `othrStdyMat/relPubl/citation/titlStmt/IDNo` | The structured `citation` requires a title (`titl`), but only the full citation text is captured. The citation text is written as plain `relPubl` content. |
| Date format of collection period | – | Only describes the input; dates are written as entered in `collDate/@date`. |
| Study group name / description | – | Not part of this extension; still unmapped as before. |

## Mapping assumptions worth reviewing

- **Study description** → `stdyInfo/abstract` (was not exported to DDI-C before).
- **Principal investigators** → `rspStmt/AuthEnty` with `@affiliation`;
  **contributors** → `rspStmt/othId` with `@role` (DDI ContributorRole term) and `@affiliation`.
- **Funders** → `prodStmt/fundAg`.
- **Subjects** → `subject/topcClas`; **topic keywords** → `subject/keyword`;
  **TheSoz keywords** → `subject/keyword` with `@vocab="TheSoz"`.
- **Countries** → `sumDscr/nation` with the ISO code as text and as `@abbr` (no country name is captured).
- **Regions** → `sumDscr/geogCover`; **universe** → `sumDscr/universe`.
- **Collection periods** → `sumDscr/collDate` with `@event="start"`/`"end"`; a period with only one date uses `@event="single"`.
  Several periods are written one after another without a `@cycle` attribute.
- **Time method, sampling procedure, mode of collection** → `method/dataColl/timeMeth|sampProc|collMode`.
  Terms of the DDI CVs are wrapped in `concept` with `@vocab` and `@vocabURI`; free-text values are written as plain text.
- **Availability** → `dataAccs/setAvail/avlStatus` (the selected label as text).
- **Notes on project/data** → `stdyDscr/notes`.
- `stdyDscr` is now always written (it was only written when a study name existed); `titl` is empty if no study name is set.

---

# Variables tab

| Field | Status | Possible DDI-C 2.5 target / remark |
|---|---|---|
| Name, Label, Description | mapped | `var/@name`, `var/labl`, `var/txt` |
| Type | mapped | `var/@representationType` (+ `@otherRepresentationType`) |
| Code list (code, name, frequency) | mapped | `var/catgry` (`catValu`, `labl`, `catStat type="freq"`) |
| Role (Identifier / Measure / Attribute) | **not mapped** | No direct equivalent. `Measure` could be `var/@nature`, identifiers could be listed in `fileDscr/fileTxt` – unclear. |
| Question Reference | **not mapped** | `var/qstn` with `qstnLit` (question text), `preQTxt` (intro), `postQTxt` (outro), `@seqNo` (Nr), `@responseDomainType` (type: `text`, `numeric`, `code`, `datetime`, `multiple`). This is a likely 1:1 mapping, but it needs a decision on whether the question should be copied into every variable that references it. |
| Unit | **not mapped** | `var/@measUnit` (free text). |
| Decimal positions | **not mapped** | `var/@dcml`. |
| Accuracy | **not mapped** | Unclear meaning; no obvious element. |

# Associated questionnaire tab

DDI-Codebook has no instrument/questionnaire section. Questions can only appear inside `var/qstn` of the
variables that reference them (see *Question Reference* above). Therefore **nothing** of this tab is written:

| Field | Possible target (via variable) |
|---|---|
| Nr | `qstn/@seqNo` |
| Question Name | – (`qstn/@ID` holds only an ID) |
| Type | `qstn/@responseDomainType` |
| multiple items | – (grid questions are documented as one `var` per item, optionally with `varGrp type="grid"`) |
| multiple answers | `qstn/@responseDomainType="multiple"` / `varGrp type="multipleResp"` |
| Question intro / text / outro | `qstn/preQTxt`, `qstn/qstnLit`, `qstn/postQTxt` |
| Answer sets (name, description, codes) | – (categories are written per variable from the variable's own code list) |
| Questions without a referencing variable | – (no place) |
