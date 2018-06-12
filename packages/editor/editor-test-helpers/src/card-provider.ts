import { CardProvider } from '@atlaskit/editor-core';

export class CardProviderMock implements CardProvider {
  public config = {};

  getType(url: string) {
    if (/product-fabric.atlassian.net\/browse\/ED-\d+$/.test(url)) {
      return 'smart-card';
    }
    if (/www.atlassian.com/.test(url)) {
      return 'custom';
    }
    return 'unsupported';
  }

  getData(url: string): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          '@context': 'https://www.w3.org/ns/activitystreams',
          '@type': 'Document',
          name: 'Welcome to Atlassian!',
          url: 'http://www.atlassian.com',
        });
      }, 1000);
    });
  }
}

export const cardProvider = new CardProviderMock();
