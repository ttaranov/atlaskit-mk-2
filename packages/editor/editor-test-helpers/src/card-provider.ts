import { CardProvider } from '@atlaskit/editor-core';

const inlineCard = {
  type: 'inlineCard',
  attrs: {
    data: {
      '@context': 'https://www.w3.org/ns/activitystreams',
      '@type': 'Document',
      name: 'Welcome to Atlassian!',
      url: 'http://www.atlassian.com',
    },
  },
};

export class DelayedCardMockProvider implements CardProvider {
  public config = {};

  resolve(url: string): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(inlineCard);
      }, 1000);
    });
  }
}

export class CardMockProvider implements CardProvider {
  resolve(url: string): Promise<any> {
    return new Promise(resolve => resolve(inlineCard));
  }
}

export const cardProvider = new DelayedCardMockProvider();
