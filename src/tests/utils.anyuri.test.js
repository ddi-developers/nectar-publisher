import { expect, describe, test } from 'vitest'
import { guessDataType } from '../modules/utils.js'

// AnyURI
describe('test utils guessDataType: AnyURI', () => {
    test('valid data - standard URIs', () => {
        const testData = [
            'http://www.w3.org/TR/xmlschema-2',
            'https://example.com/path/to/resource',
            'ftp://ftp.example.com/files/document.pdf',
            'ws://websocket.example.com/chat',
            'wss://secure.websocket.com/stream'
        ];
        expect(guessDataType(testData)).toBe('AnyURI');
    });

    test('valid data - edge cases', () => {
        const testData = [
            'http://a.co',                           // Shortest valid domain
            'https://sub.domain.example.com',        // Multiple subdomains
            'http://example.com',                    // No path
            'https://example.com/',                  // Root path
            'ftps://secure-ftp.example.com/dir/file.txt',  // Hyphenated domain
            'http://api.example.com/v1/users?id=123&name=test',  // Query params
            'https://example.com/path#anchor',       // With anchor
            'http://192-168-1-1.example.com/test'    // Numeric subdomain with hyphens
        ];
        expect(guessDataType(testData)).toBe('AnyURI');
    });

    test('invalid data - single close miss', () => {
        const testData = [
            'http://www.example.com/path',
            'https://api.example.com/v1',
            'ftp://files.example.com/docs',
            'ws://chat.example.com',
            'htp://example.com'                      // Typo in scheme - close but invalid
        ];
        expect(guessDataType(testData)).not.toBe('AnyURI');
    });

    test('invalid data - multiple invalid points', () => {
        const testData = [
            'example.com',                           // Missing scheme
            'http:/example.com',                     // Single slash
            'http//example.com',                     // Missing colon
            'file:///local/path',                    // Unsupported scheme
            'mailto:user@example.com',               // Mailto scheme not supported
            ''                                       // Empty string
        ];
        expect(guessDataType(testData)).not.toBe('AnyURI');
    });

    test('invalid data - mixed valid and invalid', () => {
        const testData = [
            'https://www.example.com/valid',         // Valid
            'not-a-url',                             // Invalid
            'http://api.example.com',                // Valid
            'www.example.com',                       // Invalid (no scheme)
            'ftp://ftp.example.com/files'            // Valid
        ];
        expect(guessDataType(testData)).not.toBe('AnyURI');
    });

    test('invalid data - malformed URIs', () => {
        const testData = [
            'http://example',                        // TLD too short
            'https://example.c',                     // TLD only 1 char
            'http://.example.com',                   // Starts with dot
            'http://example..com',                   // Double dot
            'http://example-.com',                   // Hyphen at end of label
            'http://-example.com'                    // Hyphen at start of label
        ];
        expect(guessDataType(testData)).not.toBe('AnyURI');
    });

    test('invalid data - unsupported schemes', () => {
        const testData = [
            'mailto:test@example.com',               // Email URI
            'file:///home/user/file.txt',            // File URI
            'tel:+1234567890',                       // Telephone URI
            'data:text/plain;base64,SGVsbG8=',       // Data URI
            'urn:isbn:0451450523'                    // URN
        ];
        expect(guessDataType(testData)).not.toBe('AnyURI');
    });

    test('valid data - with port numbers', () => {
        const testData = [
            'http://example.com:8080',
            'https://api.example.com:443/path',
            'ftp://files.example.com:21/docs',
            'ws://chat.example.com:3000',
            'wss://secure.example.com:8443/stream'
        ];
        expect(guessDataType(testData)).toBe('AnyURI');
    });

    test('valid data - localhost', () => {
        const testData = [
            'http://localhost',
            'http://localhost:8080',
            'https://localhost:3000/api',
            'ws://localhost:4000/socket',
            'http://localhost/path/to/resource'
        ];
        expect(guessDataType(testData)).toBe('AnyURI');
    });

    test('valid data - IP addresses', () => {
        const testData = [
            'http://192.168.1.1',
            'https://10.0.0.1:8080',
            'ftp://172.16.0.1/files',
            'http://127.0.0.1:3000/api',
            'ws://192.168.0.100:8080'
        ];
        expect(guessDataType(testData)).toBe('AnyURI');
    });

    test('valid data - mailto URIs', () => {
        const testData = [
            'mailto:user@example.com',
            'mailto:info@company.org',
            'mailto:admin@sub.domain.com',
            'mailto:test+tag@example.com',
            'mailto:contact@example.co.uk'
        ];
        expect(guessDataType(testData)).toBe('AnyURI');
    });
});
