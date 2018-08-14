import { CardProvider } from '../../../src/plugins/card/types';

export class MockProvider implements CardProvider {
  resolve(url: string): Promise<any> {
    return new Promise(resolve =>
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
      }),
    );
  }
}
