import { createTextNode, formatXml } from "../../helpers/xml.ts";
import type { Dataset } from "../../models/Dataset.ts";
import type { DatasetColumn } from "../../models/DatasetColumn.ts";
import type { VarFormat } from "../../models/VarFormat.ts";

function toDdiCXml(input: Dataset){
    const ns = "ddi:codebook:2_5"

    const xmlDoc = document.implementation.createDocument(ns, "codeBook", null);

    const codeBook = xmlDoc.documentElement;

    codeBook.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    codeBook.setAttribute("xmlns:xs", "http://www.w3.org/2001/XMLSchema")
    codeBook.setAttribute("xsi:schemaLocation", "ddi:codebook:2_5 http://www.ddialliance.org/Specification/DDI-Codebook/2.5/XMLSchema/codebook.xsd")

    if (input.studyName) {
        const stdyDscr = xmlDoc.createElementNS(ns, "stdyDscr")
        const citation = xmlDoc.createElementNS(ns, "citation")
        const titlStmt = xmlDoc.createElementNS(ns, "titlStmt")
        titlStmt.appendChild(createTextNode(xmlDoc, ns, "titl", input.studyName))
        citation.appendChild(titlStmt)
        stdyDscr.appendChild(citation)
        codeBook.appendChild(stdyDscr)
    }

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
