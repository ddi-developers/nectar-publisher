/**
 * @param {Dataset} dataset
 */
function datasetToMarkdown(dataset){
    var md = `# ${dataset.fileName}\n` +
             `**Size:** ${dataset.fileSize} bytes  \n` +
             `**Last modified:** ${dataset.lastModified}  \n` +
             `**Checksum (SHA256):** \`${dataset.sha256}\`  \n`+
             `\n`

    for(col of dataset.columns){
        md += `## ${col.id}  \n`
    }

    return md
}