declare namespace NodeJS {
  interface ReadableStream {}
  interface EventEmitter {}
  interface Process {
    env: any;
    stdin: any;
    stdout: any;
    cwd(): string;
    exit(code?: number): never;
    nextTick(callback: Function, ...args: any[]): void;
  }
}

declare var process: NodeJS.Process;
