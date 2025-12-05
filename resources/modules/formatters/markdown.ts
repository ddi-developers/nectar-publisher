import type { Dataset } from "../../models/Dataset"
import type { DatasetColumn } from "../../models/DatasetColumn";

function toMarkdown(dataset: Dataset) {
    let md = `# "${dataset.fileName}" Codebook   \n\n`

    md += printFileDescription(dataset)

    md += printDimensions(dataset)

    if (dataset.columns && dataset.columns.length > 0) {
        md += printVariables(dataset)
    }

    return md
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