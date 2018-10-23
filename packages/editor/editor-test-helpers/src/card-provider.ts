import { CardProvider } from '@atlaskit/editor-core';

type CardAppearance = 'inline' | 'block';

const mockCardData = (type: CardAppearance) => ({
  type: type === 'inline' ? 'inlineCard' : 'blockCard',
  attrs: {
    data: {
      '@context': 'https://www.w3.org/ns/activitystreams',
      '@type': 'Document',
      name: 'Welcome to Atlassian!',
      url: 'http://www.atlassian.com',
    },
  },
});

export class CardMockProvider implements CardProvider {
  resolve(url: string, appearance: CardAppearance): Promise<any> {
    return new Promise(resolve => resolve(mockCardData(appearance)));
  }
}

export type ORSCheckResponse = {
  isSupported: boolean;
};

const ORS_CHECK_URL =
  'https://api-private.stg.atlassian.com/object-resolver/check';

export class EditorCardProvider implements CardProvider {
  async resolve(url: string, appearance: CardAppearance): Promise<any> {
    try {
      const result: ORSCheckResponse = await (await fetch(ORS_CHECK_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ resourceUrl: url }),
      })).json();

      if (result && result.isSupported) {
        return {
          type: appearance === 'inline' ? 'inlineCard' : 'blockCard',
          attrs: {
            url,
          },
        };
      }
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.warn(
        `Error when trying to check Smart Card url "${url} - ${
          e.prototype.name
        } ${e.message}`,
        e,
      );
    }

    return Promise.reject(undefined);
  }
}

export class EditorExampleCardProvider implements CardProvider {
  cardProvider = new EditorCardProvider();
  mockProvider = new CardMockProvider();

  atlassianUrl = new RegExp('^https?://([a-z_-]*.)?atlassian.com');

  async resolve(url: string, appearance: CardAppearance): Promise<any> {
    if (url.match(this.atlassianUrl)) {
      return await this.mockProvider.resolve(url, appearance);
    } else {
      return await this.cardProvider.resolve(url, appearance);
    }
  }
}

export const cardProvider = new EditorExampleCardProvider();
