interface AbortController {
  readonly signal: EventTarget;
  abort(): void;
}

interface AbortControllerConstructor {
  new (): AbortController;
}

declare var AbortController: AbortControllerConstructor;
