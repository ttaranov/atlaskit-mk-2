import { utils, ServiceConfig } from '@atlaskit/util-service-support';
import { Provider } from './provider';
import { Document } from '../model';

export interface Config extends ServiceConfig {}

export default class ServiceProvider implements Provider {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async getDocument(
    documentId: string,
    language?: string,
  ): Promise<Document | null> {
    try {
      const document = await utils.requestService<Document>(this.config, {
        path: `document/${documentId}/${language || ''}`,
      });
      return document;
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.warn(`Failed to get document: ${JSON.stringify(err)}`);
      return null;
    }
  }

  async updateDocument(
    documentId: string,
    body: string,
    objectId: string,
    title?: string,
    language?: string,
  ): Promise<Document | null> {
    try {
      const document = await utils.requestService<Document>(this.config, {
        path: `document/${documentId}`,
        requestInit: {
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT',
          body: JSON.stringify({
            body,
            objectId,
            title,
            language,
          }),
        },
      });
      return document;
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.warn(`Failed to update document: ${JSON.stringify(err)}`);
      return null;
    }
  }

  async createDocument(
    body: string,
    objectId: string,
    title?: string,
    language?: string,
  ): Promise<Document | null> {
    try {
      const document = await utils.requestService<Document>(this.config, {
        path: `document`,
        requestInit: {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({
            body,
            objectId,
            title,
            language,
          }),
        },
      });
      return document;
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.warn(`Failed to update document: ${JSON.stringify(err)}`);
      return null;
    }
  }
}
