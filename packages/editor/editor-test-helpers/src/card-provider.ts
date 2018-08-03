import { CardProvider } from '@atlaskit/editor-core';

export class CardProviderMock implements CardProvider {
  public config = {};

  resolve(url: string): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          type: 'inlineCard',
          attrs: {
            data: {
              '@context': 'https://www.w3.org/ns/activitystreams',
              '@type': 'Document',
              name: 'Welcome to Atlassian!',
              url: 'http://www.atlassian.com',
            },
          },
        });
      }, 1000);
    });
  }
}

export const cardProvider = new CardProviderMock();
