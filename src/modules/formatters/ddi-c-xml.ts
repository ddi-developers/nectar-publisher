import { createTextNode, formatXml } from "../../helpers/xml.ts";
import type { Dataset } from "../../models/Dataset.ts";
import type { DatasetColumn } from "../../models/DatasetColumn.ts";
import type { VarFormat } from "../../models/VarFormat.ts";
import { DdiVocabularies, vocabularyUri, TimeMethods, SamplingProcedures, CollectionModes } from "../../models/StudyInformation.ts";

// only keep entries with content
function filled(list: string[]): string[] {
    return list.map(e => (e ?? "").trim()).filter(e => e != "")
}

function toDdiCXml(input: Dataset){
    const ns = "ddi:codebook:2_5"

    const xmlDoc = document.implementation.createDocument(ns, "codeBook", null);

    const codeBook = xmlDoc.documentElement;

    codeBook.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    codeBook.setAttribute("xmlns:xs", "http://www.w3.org/2001/XMLSchema")
    codeBook.setAttribute("xsi:schemaLocation", "ddi:codebook:2_5 http://www.ddialliance.org/Specification/DDI-Codebook/2.5/XMLSchema/codebook.xsd")

    codeBook.appendChild(createStdyDscr())

    const fileDscr = xmlDoc.createElementNS(ns, "fileDscr")
    const fileTxt = xmlDoc.createElementNS(ns, "fileTxt")

    if (input.fileName) {
        fileDscr.setAttribute("ID", input.fileName)
        fileTxt.appendChild(createTextNode(xmlDoc, ns, "fileName", input.fileName))
    }

    if (input.sha256) {
        const dataFingerprint = xmlDoc.createElementNS(ns, "dataFingerprint")
        dataFingerprint.setAttribute("type", "dataFile")
        dataFingerprint.appendChild(createTextNode(xmlDoc, ns, "digitalFingerprintValue", input.sha256))
        dataFingerprint.appendChild(createTextNode(xmlDoc, ns, "algorithmSpecification", "SHA-256"))
        fileTxt.appendChild(dataFingerprint)
    }

    const dimensns = xmlDoc.createElementNS(ns,"dimensns")
    dimensns.appendChild(createTextNode(xmlDoc, ns, "caseQnty", String(input.data.length)))
    dimensns.appendChild(createTextNode(xmlDoc, ns, "varQnty", String(input.columns.length)))
    fileTxt.appendChild(dimensns)

    if (input.mimeType) {
        fileTxt.appendChild(createTextNode(xmlDoc, ns, "fileType", input.mimeType))
    }

    fileDscr.appendChild(fileTxt)
    codeBook.appendChild(fileDscr)

    const dataDscr = xmlDoc.createElementNS(ns, "dataDscr")
    dataDscr.setAttribute("source", "producer")

    for(const column of input.columns){
        const variable = xmlDoc.createElementNS(ns, "var")
        variable.setAttribute("ID", column.id)
        variable.setAttribute("name", column.name)
        if (input.fileName) {
            variable.setAttribute("files", input.fileName)
        }
        const representationType = getVarRepresentationType(column);
        variable.setAttribute("representationType", representationType);
        if (representationType === "other" && column.hasIntendedDataType) {
            const repType =
                typeof column.hasIntendedDataType.type === "string"
                    ? column.hasIntendedDataType.type
                    : column.hasIntendedDataType.id;

            if (typeof repType === "string") {
                const normalized = repType.trim();
                const lower = normalized.toLowerCase();
                if (normalized.length > 0 && lower !== "other") {
                    variable.setAttribute("otherRepresentationType", normalized);
                }
            }
        }

        if(column.label){
            variable.appendChild(createTextNode(xmlDoc, ns, "labl", column.label))
        }

        if(column.description){
            variable.appendChild(createTextNode(xmlDoc, ns, "txt", column.description))
        }

        if(column.hasIntendedDataType?.type === "numeric"){

            const columnValuesUnique = column.valuesUnique.map(Number)

            const minStat = createTextNode(xmlDoc, ns, "sumStat", String(Math.min(...columnValuesUnique)))
            minStat.setAttribute("type", "min")
            variable.appendChild(minStat)

            const maxStat = createTextNode(xmlDoc, ns, "sumStat", String(Math.max(...columnValuesUnique)))
            maxStat.setAttribute("type", "max")
            variable.appendChild(maxStat)
        }

        if(column.codeValues){
            for(const codeValue of column.codeValues){
                const catgry = xmlDoc.createElementNS(ns, "catgry")

                catgry.appendChild(createTextNode(xmlDoc, ns, "catValu", codeValue.value))

                if(codeValue.label){
                    catgry.appendChild(createTextNode(xmlDoc, ns, "labl", codeValue.label))
                }

                if(codeValue.frequency){
                    const catStat = createTextNode(xmlDoc, ns, "catStat", String(codeValue.frequency))
                    catStat.setAttribute("type", "freq")
                    catgry.appendChild(catStat)
                }

                variable.appendChild(catgry)
            }
        }

        if (hasAnyVarFormatInfo(column.varFormat)) {
            variable.appendChild(createVarFormatElement(column.varFormat, xmlDoc, ns));
        }

        dataDscr.appendChild(variable)
    }

    codeBook.appendChild(dataDscr)

    // creates a conceptual text element, values of a DDI controlled vocabulary are wrapped in a concept element
    function createConceptualText(name: string, value: string, vocabulary: { id: string, version: string }, terms: string[]): Element {
        if (!terms.includes(value)) {
            return createTextNode(xmlDoc, ns, name, value)
        }
        const element = xmlDoc.createElementNS(ns, name)
        const concept = createTextNode(xmlDoc, ns, "concept", value)
        concept.setAttribute("vocab", vocabulary.id)
        concept.setAttribute("vocabURI", vocabularyUri(vocabulary))
        element.appendChild(concept)
        return element
    }

    function createStdyDscr(): Element {
        const study = input.studyInformation
        const stdyDscr = xmlDoc.createElementNS(ns, "stdyDscr")

        // citation
        const citation = xmlDoc.createElementNS(ns, "citation")
        const titlStmt = xmlDoc.createElementNS(ns, "titlStmt")
        titlStmt.appendChild(createTextNode(xmlDoc, ns, "titl", input.studyName ?? ""))
        for (const [titleType, elementName] of [["Subtitle", "subTitl"], ["AlternativeTitle", "altTitl"], ["TranslatedTitle", "parTitl"]] as [string, string][]) {
            for (const altTitle of study.alternativeTitles.filter(t => t.type == titleType && t.title.trim())) {
                titlStmt.appendChild(createTextNode(xmlDoc, ns, elementName, altTitle.title.trim()))
            }
        }
        citation.appendChild(titlStmt)
        const principalInvestigators = study.principalInvestigators.filter(p => p.name.trim())
        const contributors = study.contributors.filter(p => p.name.trim())
        if (principalInvestigators.length + contributors.length > 0) {
            const rspStmt = xmlDoc.createElementNS(ns, "rspStmt")
            for (const person of principalInvestigators) {
                const authEnty = createTextNode(xmlDoc, ns, "AuthEnty", person.name.trim())
                if (person.institution.trim()) {
                    authEnty.setAttribute("affiliation", person.institution.trim())
                }
                rspStmt.appendChild(authEnty)
            }
            for (const person of contributors) {
                const othId = createTextNode(xmlDoc, ns, "othId", person.name.trim())
                if (person.role) {
                    othId.setAttribute("role", person.role)
                }
                if (person.institution.trim()) {
                    othId.setAttribute("affiliation", person.institution.trim())
                }
                rspStmt.appendChild(othId)
            }
            citation.appendChild(rspStmt)
        }
        const funders = filled(study.funders)
        if (funders.length > 0) {
            const prodStmt = xmlDoc.createElementNS(ns, "prodStmt")
            for (const funder of funders) {
                prodStmt.appendChild(createTextNode(xmlDoc, ns, "fundAg", funder))
            }
            citation.appendChild(prodStmt)
        }
        stdyDscr.appendChild(citation)

        // study info
        const stdyInfo = xmlDoc.createElementNS(ns, "stdyInfo")
        const subjects = filled(study.subjects)
        const keywords = filled(study.topicKeywords)
        const thesozKeywords = filled(study.thesozKeywords)
        if (subjects.length + keywords.length + thesozKeywords.length > 0) {
            const subject = xmlDoc.createElementNS(ns, "subject")
            for (const keyword of keywords) {
                subject.appendChild(createTextNode(xmlDoc, ns, "keyword", keyword))
            }
            for (const keyword of thesozKeywords) {
                const element = createTextNode(xmlDoc, ns, "keyword", keyword)
                element.setAttribute("vocab", "TheSoz")
                subject.appendChild(element)
            }
            for (const topic of subjects) {
                subject.appendChild(createTextNode(xmlDoc, ns, "topcClas", topic))
            }
            stdyInfo.appendChild(subject)
        }
        if (input.studyDescription) {
            stdyInfo.appendChild(createTextNode(xmlDoc, ns, "abstract", input.studyDescription))
        }
        const periods = study.collectionPeriods.filter(p => p.start.trim() || p.end.trim())
        const countries = filled(study.countries)
        const regions = filled(study.regions)
        if (periods.length + countries.length + regions.length > 0 || study.universe.trim()) {
            const sumDscr = xmlDoc.createElementNS(ns, "sumDscr")
            for (const period of periods) {
                for (const [event, date] of [["start", period.start.trim()], ["end", period.end.trim()]] as [string, string][]) {
                    if (date) {
                        const collDate = createTextNode(xmlDoc, ns, "collDate", date)
                        collDate.setAttribute("date", date)
                        collDate.setAttribute("event", period.start.trim() && period.end.trim() ? event : "single")
                        sumDscr.appendChild(collDate)
                    }
                }
            }
            for (const country of countries) {
                const nation = createTextNode(xmlDoc, ns, "nation", country)
                nation.setAttribute("abbr", country)
                sumDscr.appendChild(nation)
            }
            for (const region of regions) {
                sumDscr.appendChild(createTextNode(xmlDoc, ns, "geogCover", region))
            }
            if (study.universe.trim()) {
                sumDscr.appendChild(createTextNode(xmlDoc, ns, "universe", study.universe.trim()))
            }
            stdyInfo.appendChild(sumDscr)
        }
        if (stdyInfo.hasChildNodes()) {
            stdyDscr.appendChild(stdyInfo)
        }

        // method
        const timeMethods = filled(study.timeMethods)
        const samplingProcedures = filled(study.samplingProcedures)
        const collectionModes = filled(study.collectionModes)
        if (timeMethods.length + samplingProcedures.length + collectionModes.length > 0) {
            const method = xmlDoc.createElementNS(ns, "method")
            const dataColl = xmlDoc.createElementNS(ns, "dataColl")
            for (const value of timeMethods) {
                dataColl.appendChild(createConceptualText("timeMeth", value, DdiVocabularies.timeMethod, TimeMethods))
            }
            for (const value of samplingProcedures) {
                dataColl.appendChild(createConceptualText("sampProc", value, DdiVocabularies.samplingProcedure, SamplingProcedures))
            }
            for (const value of collectionModes) {
                dataColl.appendChild(createConceptualText("collMode", value, DdiVocabularies.modeOfCollection, CollectionModes))
            }
            method.appendChild(dataColl)
            stdyDscr.appendChild(method)
        }

        // data access
        if (study.availability) {
            const dataAccs = xmlDoc.createElementNS(ns, "dataAccs")
            const setAvail = xmlDoc.createElementNS(ns, "setAvail")
            setAvail.appendChild(createTextNode(xmlDoc, ns, "avlStatus", study.availability))
            dataAccs.appendChild(setAvail)
            stdyDscr.appendChild(dataAccs)
        }

        // other study material
        const publications = study.publications.filter(p => p.citation.trim())
        if (publications.length > 0) {
            const othrStdyMat = xmlDoc.createElementNS(ns, "othrStdyMat")
            for (const publication of publications) {
                othrStdyMat.appendChild(createTextNode(xmlDoc, ns, "relPubl", publication.citation.trim()))
            }
            stdyDscr.appendChild(othrStdyMat)
        }

        if (study.notes.trim()) {
            stdyDscr.appendChild(createTextNode(xmlDoc, ns, "notes", study.notes.trim()))
        }
        return stdyDscr
    }

    const prolog = '<?xml version="1.0" encoding="UTF-8"?>'
    const xmlString = new XMLSerializer().serializeToString(xmlDoc)
    return prolog + "\n" + formatXml(xmlString)
}

function getVarRepresentationType(column: DatasetColumn) {
    if (column.coded) return "code";

    const dt =
        column && column.hasIntendedDataType
            ? (typeof column.hasIntendedDataType.type === "string"
                ? column.hasIntendedDataType.type
                : column.hasIntendedDataType.id)
            : null;
    const repType = typeof dt === "string" ? dt.toLowerCase() : null;

    const textTypes = new Set(["string"])
    const numericTypes = new Set(["numeric", "decimal"])

    if (repType === "datetime") return "datetime";
    if (repType && textTypes.has(repType)) return "text";
    if (repType && numericTypes.has(repType)) return "numeric";
    return "other"
}

function hasAnyVarFormatInfo(vf: VarFormat) {
    if (!vf) return false;
    const hasType = typeof vf.type === "string" && vf.type.trim() !== "";
    const hasSchema = typeof vf.schema === "string" && vf.schema.trim() !== "";
    const hasOtherCat = typeof vf.otherCategory === "string" && vf.otherCategory.trim() !== "";
    return hasType || hasSchema || hasOtherCat;
}

function createVarFormatElement(varFormat: VarFormat, xmlDoc: Document, ns: string) {
    const formatTypes = new Set(["character", "numeric"]);
    const formatSchemas = new Set(["SAS", "SPSS", "IBM", "ANSI", "ISO", "XML-DATA"]);
    const formatCategories = new Set(["date", "time", "currency", "other"]);

    const el = xmlDoc.createElementNS(ns, "varFormat");

    const type = typeof varFormat.type === "string" ? varFormat.type.toLowerCase() : null;
    el.setAttribute("type", type && formatTypes.has(type) ? type : "numeric");

    let schema = typeof varFormat.schema === "string" ? varFormat.schema.toUpperCase() : null;
    if (schema && formatSchemas.has(schema)) {
        el.setAttribute("schema", schema === "XML-DATA" ? "XML-Data" : schema);
    } else {
        el.setAttribute("schema", "other");
    }

    const otherCategory = typeof varFormat.otherCategory === "string" ? varFormat.otherCategory.toLowerCase() : null;
    if (otherCategory && formatCategories.has(otherCategory)) {
        el.setAttribute("category", otherCategory);
    } else if (otherCategory) {
        el.setAttribute("otherCategory", otherCategory);
    }

    return el;
}

export { toDdiCXml }
