export function logWarning(...args: any[]): void {
  if (!process.env['MINTER_NO_LOGS']) {
    console.warn(...args);
  }
}
