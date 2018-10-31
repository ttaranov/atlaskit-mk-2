import { CardAppearance } from '../Card';

export interface CardProvider {
  resolve(url: string, appearance: CardAppearance): Promise<any>;
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
      // tslint:disable-next-line
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

export const editorCardProvider = new EditorCardProvider();
