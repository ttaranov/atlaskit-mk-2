import { ObjectState } from './ObjectState';
import { ObjectStateStream } from './ObjectStateStream';

export interface ClientOptions {
  serviceUrl?: string;
}

export class Client {
  private readonly serviceUrl: string;

  constructor(options: ClientOptions = {}) {
    const {
      serviceUrl = 'https://api-private.stg.atlassian.com/object-resolver',
    } = options;
    this.serviceUrl = serviceUrl;
  }

  get(url: string, callback: (state: ObjectState) => void): ObjectStateStream {
    return new ObjectStateStream({
      serviceUrl: this.serviceUrl,
      objectUrl: url,
      callback,
    });
  }
}
