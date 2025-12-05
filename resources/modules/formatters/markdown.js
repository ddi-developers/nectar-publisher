/**
 * @param {Dataset} dataset
 */
function toMarkdown(dataset) {
    var md = `# "${dataset.fileName}" Codebook documentation\n\n`

    md += printFileDescription(dataset)

    md += printDimensions(dataset)

    if (dataset.columns && dataset.columns.length > 0) {
        md += printVariables(dataset)
    }

    return md
}

function printFileDescription(dataset) {
    var mdText = `## File Description \n`
    mdText += `**ID:** ${dataset.fileName}  \n`
    mdText += `**Type:** ${dataset.mimeType}  \n`
    mdText += `**Size:** ${dataset.fileSize} bytes  \n`
    mdText += `**Last modified:** ${dataset.lastModified}  \n`
    mdText += `**Checksum (SHA256):** \`${dataset.sha256}\`  \n`
    mdText += `\n`
    return mdText
}

function printDimensions(dataset) {
    var mdText = `## File Dimensions \n`
    mdText += `**Number of cases or observations:**: ${dataset.data.length}\n`
    mdText += `**Number of variables:**: ${dataset.columns.length}\n`
    mdText += '\n'
    return mdText
}

function printVariableStats(col) {
    var mdText = ''
    var columnValuesUnique = col.valuesUnique.map(Number)
    var statsToCompute = [Math.min, Math.max]
    var statsToComputeNames = ["Min. value", "Max. value"]

    for (var i = 0; i < statsToCompute.length; ++i) {
        var statComputed = statsToCompute[i](...columnValuesUnique);
        mdText += `**${statsToComputeNames[i]}:** ${statComputed}\n`
    }
    return mdText
}


function printVariableCodeValues(col) {
    var mdText = `#### Code values \n`
    mdText+= "| Code | Name | Frequency | \n"
    mdText+= "| ---- | ---- | --------- | \n"
     for (const codeValue of col.codeValues) {
        mdText+=`| ${codeValue.value} |  ${codeValue.label} |  ${codeValue.frequency}| \n`
    }
    return mdText
}


function printVariables(dataset) {
    var mdText = `## Variables \n`

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

        if (col.hasIntendedDataType.type === "numeric") {
            mdText += printVariableStats(col)
        }

        if (col.codeValues && col.codeValues.length > 0) {
            mdText += printVariableCodeValues(col)
        }

        mdText += '\n'



    }

    return mdText

}


function getVarRepresentationType(column) {
    if (column.coded) {
        return "Coded"
    } else if (column.hasIntendedDataType) {
        return column.hasIntendedDataType.id
    }

    return "Other"
}



export { toMarkdown }