import { MediaClient } from './mediaClient';
import { AuthProvider } from '@atlaskit/media-core';

export class MediaClientPool {
  private clients: { [collection: string]: MediaClient } = {};
  private clientForAbsentCollection?: MediaClient;

  constructor(private readonly authProvider: AuthProvider) {}

  getMediaClient = (collection?: string): MediaClient => {
    return this.getStoredClient(collection) || this.createNewClient(collection);
  };

  private createNewClient = (collection?: string): MediaClient => {
    const client = new MediaClient(this.authProvider, collection);
    this.setClient(client, collection);
    return client;
  };

  private getStoredClient = (collection?: string): MediaClient | undefined => {
    if (collection === undefined) {
      return this.clientForAbsentCollection;
    }

    return this.clients[collection];
  };

  private setClient = (client: MediaClient, collection?: string): void => {
    if (collection === undefined) {
      this.clientForAbsentCollection = client;
      return;
    }

    this.clients[collection] = client;
  };
}
