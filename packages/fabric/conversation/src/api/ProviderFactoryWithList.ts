import { ProviderFactory } from '@atlaskit/editor-common';

// @TODO Delete this once we can just pass the factory directly to editor
export default class ProviderFactoryWithList extends ProviderFactory {
  // To be exposed via list()
  private listableProviders: Map<string, Promise<any>> = new Map();

  /**
   * Overwrite the method to store an exposable variable
   * @param {string} name
   * @param {Promise<any>} provider
   */
  setProvider(name: string, provider?: Promise<any>) {
    super.setProvider(name, provider);

    if (provider) {
      this.listableProviders.set(name, provider);
    } else {
      this.listableProviders.delete(name);
    }
  }

  listProviders() {
    const providers = {};

    this.listableProviders.forEach((provider: Promise<any>, key: string) => {
      providers[key] = provider;
    });

    return providers;
  }
}
