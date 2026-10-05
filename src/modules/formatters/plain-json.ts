export function toPlainJson(input: unknown): string {
    return JSON.stringify(input, null, 5)
}
