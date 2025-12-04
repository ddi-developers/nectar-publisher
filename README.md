# Nectar Publisher 🐝

Document your tabular datasets and create codebooks and machine actionable metadata using DDI.

> [!NOTE]
> Nectar Publisher is under early development and might not work correctly

## Run the application

* On GitHub pages: https://ddi-developers.github.io/nectar-publisher
* Localy by download and extracting [this zip-file](https://github.com/ddi-developers/nectar-publisher/archive/refs/heads/main.zip) (works offline when downloaded)


## Implementation and status for `Nectar Publisher 1.0`

### Dataset inputs
- [x] CSV / TSV - files
- [x] Excel / ODS spreadsheet
- [x] SPSS (local in browser via [WebR](https://www.npmjs.com/package/webr) with [DDIwR](https://cran.r-project.org/web/packages/DDIwR/))

### Metadata imports
- [ ] DDI-Codebook 2.5 variable documentation
- [ ] DDI-Lifecycle 3.3 variable documentation

### Output
- [ ] Metadata
  - [ ] DDI-Codebook 2.5 XML
  - [ ] DDI-Lifecycle 3.3 XML
  - [ ] DDI-CDI JSON-LD
- [ ] Codebook
  - [ ] Markdown
  - [ ] Html
  - [ ] Pdf

### Plugin system to push metadata & data to external repository
- [ ] Define a interface with methods for export
- [ ] Example implementation for a repository

### Column based listing with variables in focus
- [x] Responsive layout
- [ ] User interviews and requirements for efficent interface
- [ ] Layout design

### Metadata

#### Data file documentation
- [x] File metadata (extracted from file)
  - [x] filename
  - [x] delimiter
  - [x] mimeType
  - [x] size (bytes)
  - [x] checksum (sha256)
- [ ] Variable metadata (autodetected & input)
  - [x] Id (column header name if exist, fallback to column number)
  - [x] Column number (auto generated on file import)
  - [x] Name (set to column header if existing)
  - [ ] Label
  - [x] Description
  - [x] DataType
  - [ ] UnitCode
  - [ ] Min/Max value
  - [ ] CollectionMethod
  - [ ] ResponseDomain
    - [ ] Text
    - [ ] Numeric
    - [ ] Datetime
    - [ ] Code
      - [ ] value
      - [ ] label
      - [ ] isMissingValue
      - [ ] frequency

## Build instructions

1. Colone this repository
2. Install dependecies with `npm install`
3. Build with `npm run build`

## Run locally for development
1. run `npm install`
2. run `npm run dev`
3. Open `http://localhost:5173` in your browser

## License

[MIT](LICENSE)