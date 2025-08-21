
/**
 * Calculates the checksum of a file using the specified cryptographic algorithm.
 * 
 * @param file - The Blob object representing the file to calculate checksum for
 * @param algorithm - The cryptographic algorithm identifier (e.g., 'SHA-256', 'SHA-1', 'MD5')
 * @returns A Promise that resolves to the hexadecimal string representation of the checksum
 * 
 * @example
 * ```typescript
 * const file = new Blob(['hello world'], { type: 'text/plain' });
 * const hash = await checksum(file, 'SHA-256');
 * console.log(hash); // outputs the SHA-256 hash as hex string
 * ```
 */
export async function checksum(file: Blob, algorithm: AlgorithmIdentifier): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Calculates the checksum of a string using the specified cryptographic algorithm.
 * 
 * @param string - The string to calculate checksum for
 * @param type - The cryptographic algorithm identifier (e.g., 'SHA-256', 'SHA-1', 'MD5')
 * @returns A Promise that resolves to the hexadecimal string representation of the checksum
 */
async function hashString(string: string, type: AlgorithmIdentifier): Promise<string> {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest(type, utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
    return hashHex;
}
