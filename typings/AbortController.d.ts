interface IAbortController {
  readonly signal: EventTarget;
  abort(): void;
}

interface AbortControllerConstructor {
  new (): IAbortController;
}

declare var AbortController: AbortControllerConstructor;
