/**
 * @param {Dataset} dataset
 */
function datasetToMarkdown(dataset){
    var md = `# ${dataset.fileName}\n` +
             `**Type:** ${dataset.mimeType}  \n` +
             `**Size:** ${humanFileSize(dataset.fileSize, true)} (${dataset.fileSize} bytes)  \n` +
             `**Last modified:** ${dataset.lastModified}  \n` +
             `**Checksum (SHA256):** \`${dataset.sha256}\`  \n`+
             `\n\n`

    md += `## Variables\n\n`
    for(col of dataset.columns){
        md += `### ${col.id}  \n\n` +
              ` label: ${col.label}  \n` +
              `\n`
    }

    return md
}
