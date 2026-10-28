import type { Dataset } from "../../models/Dataset"
import type { DatasetColumn } from "../../models/DatasetColumn";

function toMarkdown(dataset: Dataset) {
    let md = `# "${dataset.fileName}" Codebook   \n\n`

    md += printStudyDescription(dataset)

    md += printFileDescription(dataset)

    md += printDimensions(dataset)

    if (dataset.columns && dataset.columns.length > 0) {
        md += printVariables(dataset)
    }

    return md
}

function printList(label: string, values: string[]) {
    const filled = values.map(v => (v ?? "").trim()).filter(v => v != "")
    return filled.length > 0 ? `**${label}:** ${filled.join("; ")}  \n` : ''
}

function printStudyDescription(dataset: Dataset) {
    const study = dataset.studyInformation
    let mdText = `## Study Description \n`
    if (dataset.studyName) {
        mdText += `**Title:** ${dataset.studyName}  \n`
    }
    for (const altTitle of study.alternativeTitles.filter(t => t.title.trim())) {
        mdText += `**${altTitle.type || "Further title"}:** ${altTitle.title.trim()}  \n`
    }
    mdText += printList("Principal investigators", study.principalInvestigators.map(p => p.name.trim() && p.institution.trim() ? `${p.name.trim()} (${p.institution.trim()})` : p.name))
    mdText += printList("Publishers", study.publishers)
    if (study.publicationYear) {
        mdText += `**Publication year:** ${study.publicationYear}  \n`
    }
    if (study.availability) {
        mdText += `**Availability:** ${study.availability}  \n`
    }
    mdText += printList("Contributors", study.contributors.map(p => {
        const details = [p.institution.trim(), p.role].filter(d => d)
        return p.name.trim() && details.length > 0 ? `${p.name.trim()} (${details.join(", ")})` : p.name
    }))
    mdText += printList("Funders", study.funders)
    mdText += printList("Subjects", study.subjects)
    mdText += printList("Topic keywords", study.topicKeywords)
    mdText += printList("TheSoz keywords", study.thesozKeywords)
    if (dataset.studyDescription) {
        mdText += `\n**Abstract:**  \n${dataset.studyDescription}  \n\n`
    }
    mdText += printList("Countries", study.countries)
    mdText += printList("Regions", study.regions)
    mdText += printList("Time dimension", study.timeMethods)
    if (study.universe.trim()) {
        mdText += `**Universe:** ${study.universe.trim()}  \n`
    }
    mdText += printList("Sampling procedures", study.samplingProcedures)
    mdText += printList("Modes of data collection", study.collectionModes)
    mdText += printList(`Collection periods (${study.collectionDateFormat})`, study.collectionPeriods.map(p => [p.start.trim(), p.end.trim()].filter(d => d).join(" – ")))
    mdText += printList("Publications", study.publications.map(p => p.citation.trim() && p.identifier.trim() ? `${p.citation.trim()} (${p.identifier.trim()})` : p.citation))
    if (study.notes.trim()) {
        mdText += `\n**Notes:**  \n${study.notes.trim()}  \n`
    }
    if (dataset.studyGroupName) {
        mdText += `\n**Study group:** ${dataset.studyGroupName}  \n`
        if (dataset.studyGroupDescription) {
            mdText += `${dataset.studyGroupDescription}  \n`
        }
    }
    mdText += `\n`
    return mdText
}

function printFileDescription(dataset: Dataset) {
    let mdText = `## File Description \n`
    mdText += `**ID:** ${dataset.fileName}  \n`
    mdText += `**Type:** ${dataset.mimeType}  \n`
    mdText += `**Size:** ${dataset.fileSize} bytes  \n`
    mdText += `**Last modified:** ${dataset.lastModified}  \n`
    mdText += `**Checksum (SHA256):** \`${dataset.sha256}\`  \n`
    mdText += `\n`
    return mdText
}

function printDimensions(dataset: Dataset) {
    let mdText = `## File Dimensions \n`
    mdText += `**Number of cases or observations:** ${dataset.data.length}  \n`
    mdText += `**Number of variables:** ${dataset.columns.length}  \n`
    mdText += '\n'
    return mdText
}

function printVariableStats(col: DatasetColumn) {
    let mdText = ''
    let columnValuesUnique = col.valuesUnique.map(Number)
    let statsToCompute = [Math.min, Math.max]
    let statsToComputeNames = ["Min. value", "Max. value"]

    for (let i = 0; i < statsToCompute.length; ++i) {
        let statComputed = statsToCompute[i](...columnValuesUnique);
        mdText += ` - **${statsToComputeNames[i]}:** ${statComputed}  \n`
    }
    return mdText
}


function printVariableCodeValues(col: DatasetColumn) {
    let mdText = ''
    mdText += " > | Code | Name | Frequency |   \n"
    mdText += " > | :---- | :----: | ---------: |   \n"
    for (const codeValue of col.codeValues) {
        mdText += " > |```" + ` ${codeValue.value}` + "```" + ` |  ${codeValue.label} |  ${codeValue.frequency}|   \n`
    }
    mdText += "\n"
    return mdText
}


function printVariables(dataset: Dataset) {
    let mdText = `## Variables   \n`

    var ii=0
    for (var col of dataset.columns) {
        mdText += `#### ${ii}. '${col.id}'   \n`
        mdText += ` - **Variable name:** ${col.name}   \n`
        mdText += ` - **Variable representation type:** ${getVarRepresentationType(col)}   \n`
        if (col.label) {
            mdText += ` - **Label:** ${col.label}   \n`
        }
        if (col.description) {
            mdText += ` - **Variable description:** ${col.description}   \n`
        }

        if (col.hasIntendedDataType.type === "numeric") {
            mdText += printVariableStats(col)
        }


        if (col.codeValues && col.codeValues.length > 0) {
            mdText += printVariableCodeValues(col)
        }

        mdText += '  \n'
        ii++


    }

    return mdText

}


function getVarRepresentationType(column: DatasetColumn) {
    if (column.coded) {
        return "Coded"
    } else if (column.hasIntendedDataType) {
        return column.hasIntendedDataType.id
    }

    return "Other"
}



export { toMarkdown }