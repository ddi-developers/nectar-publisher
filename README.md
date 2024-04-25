# Nectar Publisher 🐝

Document your tabular datasets and create codebooks and machine actionable metadata using DDI.

## Run the application

* On GitHub pages: https://ddi-developers.github.io/nectar-publisher
* Localy by download and extracting [this zip-file](https://github.com/borsna/nectar-publisher/archive/refs/heads/main.zip) (no internet connection required after download)


## Implementation and status for `Nectar Publisher 1.0`

### Dataset inputs
- [x] CSV / TSV - files
- [x] Excel / ODS spreadsheet
- [ ] SPSS

### Metadata imports
- [ ] DDI-C 2.5 variable documentation
- [ ] DDI-L 3.3 variable documentation

### Output
- [ ] Metadata
  - [ ] DDI-C 2.5 XML
  - [ ] DDI-L 3.3 XML
  - [ ] DDI-CDI JSON-LD
- [ ] Codebook
  - [ ] Markdown
  - [ ] Html
  - [ ] Pdf

### Plugin system to push metadata & data to external repository
- [ ] Define a interface and
- [ ] Example implementation

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
  - [x] checksum (sha256)
- [ ] Variable metadata (autodetected & input)
  - [x] Id (column header name if exist, fallback to column number)
  - [x] Column number (auto generated on file import)
  - [x] Name (set to column header if existing)
  - [ ] Label
  - [ ] Description
  - [ ] DataType
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

No build tools required.  
Nectar Publisher aims for easy development & deployment without the need for any special tools or processes.  
Open any source file; edit, save see changes in the browser [KISS Principle](https://en.wikipedia.org/wiki/KISS_principle).

## License

MIT
