
/**
 * Copies the provided text to the system clipboard using the Clipboard API.
 * 
 * @param text - The text string to be copied to the clipboard
 */
export function copyTextToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
        console.info("Content copied to clipboard");
    },() => {
        console.error("Failed to copy to clipboard");
    });
}


/**
 * Downloads a file in the browser by creating a temporary download link and triggering it.
 * Handles browser compatibility differences between Chrome/WebKit and Firefox.
 * 
 * @param fileName - The name to give the downloaded file
 * @param content - The Blob containing the file data to be downloaded
 */
export function saveFileBrowser(fileName: string, content: Blob): void {
    const downloadLink: HTMLAnchorElement = window.document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.innerHTML = "Download File";
    
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(content);
    } else {
        // Firefox requires the link to be added to the DOM before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(content);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function destroyClickedElement(event: Event): void {
    const target = event.target as HTMLElement;
    document.body.removeChild(target);
}