declare namespace NodeJS {
  interface ReadableStream {}
  interface EventEmitter {}
  interface Process {
    stdin: any;
    stdout: any;
    cwd(): string;
    exit(code?: number): never;
    nextTick(callback: Function, ...args: any[]): void;
    env: any;
  }
}

declare var process: NodeJS.Process;
