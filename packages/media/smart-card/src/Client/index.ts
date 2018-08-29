import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
  Command,
  ObjectState,
  ObjectStatus,
  AuthService,
  TemporaryResolver,
} from './types';
import { race } from './race';
import { createObjectResolverServiceObservable } from './createObjectResolverServiceObservable';
import { createTemporaryResolverObservable } from './createTemporaryResolverObservable';

// TODO: add some form of caching so that urls not currently loaded will still be fast

export interface ClientOptions {
  serviceUrl?: string;
  TEMPORARY_resolver?: TemporaryResolver;
}

export class Client {
  static SERVICE_URL = 'https://api-private.stg.atlassian.com/object-resolver'; // TODO: use prod URL here

  private readonly serviceUrl: string;
  private readonly temporaryResolver?: TemporaryResolver;
  private readonly pool: Map<string, Observable<ObjectState>> = new Map();
  private readonly $commands: Subject<Command> = new Subject();

  constructor(options: ClientOptions = {}) {
    const { serviceUrl = Client.SERVICE_URL } = options;
    this.serviceUrl = serviceUrl;
    this.temporaryResolver = options.TEMPORARY_resolver;
  }

  private createObservable(url: string): Observable<ObjectState> {
    const temporaryResolver = this.temporaryResolver;
    if (temporaryResolver) {
      return race(
        createTemporaryResolverObservable(url, temporaryResolver),
        createObjectResolverServiceObservable({
          serviceUrl: this.serviceUrl,
          objectUrl: url,
          $commands: this.$commands,
        }),
      );
    } else {
      return createObjectResolverServiceObservable({
        serviceUrl: this.serviceUrl,
        objectUrl: url,
        $commands: this.$commands,
      });
    }
  }

  get(url: string): Observable<ObjectState> {
    return new Observable<ObjectState>(observer => {
      let observable = this.pool.get(url);
      if (!observable) {
        observable = this.createObservable(url);
        this.pool.set(url, observable);
      }
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
