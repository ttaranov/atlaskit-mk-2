import { Result } from '../model/Result';
import { ServiceConfig } from '@atlaskit/util-service-support';

export interface ConfluenceClient {
  getRecentPages(): Promise<Result[]>;
  getRecentSpaces(): Promise<Result[]>;
}

export default class ConfluenceClientImpl implements ConfluenceClient {
  // @ts-ignore TODO ignore unused for now
  private serviceConfig: ServiceConfig;
  // @ts-ignore TODO ignore unused for now
  private cloudId: string;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  public async getRecentPages(): Promise<Result[]> {
    // TODO impl
    return Promise.resolve([]);
  }

  public async getRecentSpaces(): Promise<Result[]> {
    // TODO impl
    return Promise.resolve([]);
  }
}
