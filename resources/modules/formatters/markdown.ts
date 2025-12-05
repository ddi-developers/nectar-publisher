import type { Dataset } from "../../models/Dataset"
import type { DatasetColumn } from "../../models/DatasetColumn";

function toMarkdown(dataset: Dataset) {
    let md = `# "${dataset.fileName}" Codebook documentation\n\n`
        + printFileDescription(dataset)
        + printDimensions(dataset);

    if (dataset.columns && dataset.columns.length > 0) {
        md += printVariables(dataset)
    }

    return md
}

function printFileDescription(dataset: Dataset) {
    return `## File Description \n`
        + `**ID:** ${dataset.fileName}  \n`
        +`**Type:** ${dataset.mimeType}  \n`
        + `**Size:** ${dataset.fileSize} bytes  \n`
        + `**Last modified:** ${dataset.lastModified}  \n`
        + `**Checksum (SHA256):** \`${dataset.sha256}\`  \n`
        + `\n`;
}

function printDimensions(dataset: Dataset) {
    let mdText = `## File Dimensions \n`
    mdText += `**Number of cases or observations:**: ${dataset.data.length}\n`
    mdText += `**Number of variables:**: ${dataset.columns.length}\n`
    mdText += '\n'
    return mdText
}

function printVariableStats(col: DatasetColumn) {
    let columnValuesUnique = col.valuesUnique.map(Number)

    const mdText = `**Min. value:** ${Math.min(...columnValuesUnique)}\n`
                 + `**Max. value:** ${Math.max(...columnValuesUnique)}\n`

    return mdText
}


function printVariableCodeValues(col: DatasetColumn) {
    let mdText = `#### Code values \n`
    mdText+= "| Code | Name | Frequency | \n"
    mdText+= "| ---- | ---- | --------- | \n"
    for (const codeValue of col.codeValues) {
        mdText+=`| ${codeValue.value} |  ${codeValue.label} |  ${codeValue.frequency}| \n`
    }
    return mdText
}


function printVariables(dataset: Dataset) {
    let mdText = `## Variables \n`

    for (const col of dataset.columns) {
        mdText += `### var '${col.id}' \n`
        mdText += `**Variable name:** ${col.name} \n`
        mdText += `**Variable representation type:** ${getVarRepresentationType(col)} \n`
        if (col.label) {
            mdText += `**Label:** ${col.label} \n`
        }
        if (col.description) {
            mdText += `**Variable description:** ${col.description} \n`
        }

        if (col.hasIntendedDataType?.type === "numeric") {
            mdText += printVariableStats(col)
        }

        if (col.codeValues && col.codeValues.length > 0) {
            mdText += printVariableCodeValues(col)
        }

        mdText += '\n'



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
