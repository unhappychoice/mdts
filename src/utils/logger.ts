class Logger {
  log(message: string, ...args: unknown[]): void {
    console.log(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(message, ...args);
  }
}

export const logger = new Logger();
