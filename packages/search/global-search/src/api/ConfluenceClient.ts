import { Result, ResultType } from '../model/Result';
import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';

export interface ConfluenceClient {
  getRecentPages(): Promise<Result[]>;
  getRecentSpaces(): Promise<Result[]>;
}

export default class ConfluenceClientImpl implements ConfluenceClient {
  private serviceConfig: ServiceConfig;
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
