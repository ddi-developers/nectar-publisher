# Unmapped fields – Markdown

All fields of the *Dataset Information* tab are written by `src/modules/formatters/markdown.ts`
in the section *Study Description* (empty fields are skipped).

## Notes

- Controlled vocabulary terms (title type, contributor role, time dimension, sampling procedure, mode of collection)
  are printed as their technical term (e.g. `Interview.Telephone.CATI`), not as a human readable label.
- The date format of the collection period is printed next to the label, the dates as entered.
- The HTML export is generated from the Markdown and contains the same information.

---

# Variables tab

| Field | Status |
|---|---|
| Name, Label, Description, Type, Coded | mapped (`## Variables`) |
| Code list (code, name, frequency) | mapped (table per variable) |
| Min / max (numeric) | mapped (computed from the data) |
| Role | **not printed** |
| Question Reference | **not printed** (could print the referenced question name/text) |
| Unit, Decimal positions, Accuracy | **not printed** (these fields are not declared in `DatasetColumn.ts`) |

Remark: variables are numbered starting with `0.`.

# Associated questionnaire tab

**Nothing** is printed: no question number, name, type, intro/question/outro text, item lists or answer
sets (name, description, codes). A section *Questionnaire* (one entry per question with its answer set
as a table) would be needed.
