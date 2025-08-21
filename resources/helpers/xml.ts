/**
 * Formats XML string with indentation
 * @param xml - The XML string to format
 * @param tab - Optional indent value, defaults to two spaces
 * @returns Formatted XML string
 */
export function formatXml(xml: string, tab?: string): string {
  let formatted = '';
  let indent = '';
  tab = tab || '  ';
  
  xml.split(/>\s*</).forEach(function(node) {
      if (node.match(/^\/\w/)) indent = indent.substring(tab.length); // decrease indent by one 'tab'
      formatted += indent + '<' + node + '>\r\n';
      if (node.match(/^<?\w[^>]*[^\/]$/)) indent += tab;              // increase indent
  });
  
  return formatted.substring(1, formatted.length-3);
}

/**
 * Creates an XML element with text content
 * @param xmlDoc - The XML document
 * @param ns - Namespace
 * @param name - Element name
 * @param text - Text content
 * @returns Element with text content
 */
export function createTextNode(xmlDoc: Document, ns: string, name: string, text: string): Element {
  const element = xmlDoc.createElementNS(ns, name);
  const elementText = xmlDoc.createTextNode(text);
  element.appendChild(elementText);
  return element;
}