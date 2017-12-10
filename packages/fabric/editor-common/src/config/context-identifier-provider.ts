export interface ContextIdentifier {
  containerId: string;
  objectId: string;
}

export interface ContextIdentifierProvider {
  getContext(): ContextIdentifier;
}

export class ContextIdentifierResource implements ContextIdentifierProvider {
  private context: ContextIdentifier;

  constructor(config: ContextIdentifier) {
    this.context = config;
  }

  getContext(): ContextIdentifier {
    return this.context;
  }
}
