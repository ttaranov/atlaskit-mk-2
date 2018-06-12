import { Subject, Observable } from 'rxjs';
import { Command } from './Command';
import {
  createObjectStateObservable,
  ObjectState,
  ObjectStatus,
  AuthService,
} from './createObjectStateObservable';

// TODO: add some form of caching so that urls not currently loaded will still be fast

export interface ClientOptions {
  serviceUrl?: string;
}

export class Client {
  static SERVICE_URL = 'https://api-private.stg.atlassian.com/object-resolver';

  private readonly serviceUrl: string;
  private readonly pool: Map<string, Observable<ObjectState>> = new Map();
  private readonly $commands: Subject<Command> = new Subject();

  constructor(options: ClientOptions = {}) {
    const { serviceUrl = Client.SERVICE_URL } = options;
    this.serviceUrl = serviceUrl;
  }

  get(url: string): Observable<ObjectState> {
    return new Observable<ObjectState>(observer => {
      let observable = this.pool.get(url);
      if (!observable) {
        observable = createObjectStateObservable(url, {
          serviceUrl: this.serviceUrl,
          objectUrl: url,
          $commands: this.$commands,
        });
      }
      this.pool.set(url, observable);
      const subscription = observable.subscribe(state => observer.next(state));
      return () => {
        this.pool.delete(url);
        subscription.unsubscribe();
      };
    });
  }

  reload(provider: string) {
    this.$commands.next({
      type: 'reload',
      provider,
    });
  }
}

export { ObjectStatus, ObjectState, AuthService };
