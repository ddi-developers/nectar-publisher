# Unmapped fields – DDI-CDI (JSON-LD)

Fields of the *Dataset Information* tab that are **not** written by `src/modules/formatters/ddi-cdi-json-ld.ts`.

> **Note on versions:** the export references the JSON-LD context
> `https://ddi-alliance.bitbucket.io/DDI-CDI/DDI-CDI_v1.0-rc1/encoding/json-ld/ddi-cdi.jsonld`,
> which is no longer reachable ("Repository not found"). The new `catalogDetails` block follows the
> **DDI-CDI 1.0 (final)** JSON-LD encoding (`DataSet-catalogDetails`, `CatalogDetails`, `AgentInRole`,
> `BibliographicName`, `InternationalString`). The rest of the export still uses rc1 names
> (e.g. `WideDataset` instead of `WideDataSet`), so the whole file should be moved to the 1.0 context.

## Mapped (in `WideDataset.catalogDetails`)

| Field | CDI 1.0 |
|---|---|
| Study name | `CatalogDetails.title` |
| Further titles `Subtitle` / `AlternativeTitle` | `CatalogDetails.subTitle` / `CatalogDetails.alternativeTitle` |
| Study description | `CatalogDetails.summary` |
| Principal investigators | `CatalogDetails.creator` → `AgentInRole.agentName` (`BibliographicName` with `affiliation`) |
| Contributors | `CatalogDetails.contributor` → `AgentInRole` with `role.term.entryValue` (DDI ContributorRole term, no vocabulary reference) |
| Publishers | `CatalogDetails.publisher` → `AgentInRole.agentName` |

Strings are written as JSON-LD value objects (`{"@value": "…"}`), because `languageSpecificString` is
declared with `"@type": "@id"` in the context, but its range (`ComplexLanguageString`) is a `rdf:langString`.
This encoding should be checked with the SHACL shapes.

## Not mapped

| Field | Possible target | Why it is not mapped |
|---|---|---|
| Further titles `TranslatedTitle` / `Other` | `CatalogDetails.alternativeTitle` with a language tag | Language not captured; `Other` has no clear target. |
| Publication year | `CatalogDetails.date` (`CombinedDate`) | `isoDate` is `xsd:date` (a year alone does not fit) and the `semantics` vocabulary for "publication" is unclear. |
| Availability | `CatalogDetails.access` (`AccessInformation.rights`) | Unclear how the availability terms map to rights/license. |
| Funders | `Organization` + `AgentInRole` (role "FundingProvision") | No funder slot in `CatalogDetails`; needs agent modelling. |
| Subjects, topic keywords, TheSoz keywords | – | CDI 1.0 has no topical coverage/keyword property on `CatalogDetails`. |
| Country, region | – | No spatial coverage in CDI 1.0 study-level metadata. |
| Time dimension, sampling procedure, modes of collection, collection period | `Activity` / `Step` (process model) | Requires modelling the data collection as a process; unclear how. |
| Universe | `Universe.descriptiveText` | A `Universe` can be created, but it is unclear what it should be linked to (no `InstanceVariable`/`Population` link is created by the export). |
| Publications | `CatalogDetails.relatedResource` (`Reference`) | `Reference` has no citation text property; only `description`/`uri`. |
| Notes on project/data | – | No suitable property. |
| Study group name / description | – | Not part of this extension. |

---

# Variables tab

| Field | Status | Possible DDI-CDI target / remark |
|---|---|---|
| Name | mapped | `InstanceVariable.name` (`ObjectName`) |
| Type | mapped | `InstanceVariable.physicalDataType` (entry value only, no vocabulary) |
| Label | mapped, **questionable** | Written into `displayLabel.locationVariant.entryValue`. `locationVariant` describes *where* a label is used, the text itself belongs into the `languageSpecificString` of the `LabelForDisplay`. |
| Description | **not mapped** | `descriptiveText` (inherited from `ConceptualVariable`). |
| Role | mapped, **bug** | `IdentifierComponent` / `AttributeComponent` / `MeasureComponent`; the latter two use `isDefinedBy: "#<uuid>"` instead of `"#instanceVariable-<uuid>"`, so they point to nothing. |
| Coded + code list | partly | A `SubstantiveValueDomain` and a SKOS concept scheme are created, but the code values are pushed as plain app objects (`value`, `label`, `uuid`, …) without CDI types (`Code`, `Category`, `CodeList`). |
| Code frequency | **not mapped** | No statistics in CDI 1.0. |
| Question Reference | **not mapped** | CDI 1.0 has no question/instrument classes; a link to a DDI-L question would need an external `Reference` – unclear. |
| Unit | **not mapped** | `RepresentedVariable-simpleUnitOfMeasure` (inherited by `InstanceVariable`) – likely target, not checked against the shapes. |
| Decimal positions | **not mapped** | `ValueMapping-decimalPositions` – likely target. |
| Accuracy | **not mapped** | Unclear meaning; no obvious property. |

# Associated questionnaire tab

**Nothing** is written. DDI-CDI 1.0 does not model questionnaires (no question, instrument, instruction or
response domain classes). Answer sets could become `CodeList`/`Category` objects, but they would not be
connected to anything unless a variable uses them.
