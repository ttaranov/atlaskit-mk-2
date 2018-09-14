import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { filter } from 'rxjs/operators/filter';
import {
  ObjectState,
  ObjectStatus,
  AuthService,
  TemporaryResolver,
} from './types';
import { createObjectResolverServiceObservable } from './createObjectResolverServiceObservable';
import { createTemporaryResolverObservable } from './createTemporaryResolverObservable';

// TODO: add some form of caching so that urls not currently loaded will still be fast

export interface ClientOptions {
  serviceUrl?: string;
  TEMPORARY_resolver?: TemporaryResolver;
}

const within = (e: any) => (c: any[]): boolean => c.indexOf(e) > -1;

export class Client {
  static SERVICE_URL = 'https://api-private.stg.atlassian.com/object-resolver'; // TODO: use prod URL here

  private readonly serviceUrl: string;
  private readonly temporaryResolver?: TemporaryResolver;
  private readonly pool: Map<string, Observable<ObjectState>> = new Map();

  constructor(options: ClientOptions = {}) {
    const { serviceUrl = Client.SERVICE_URL } = options;
    this.serviceUrl = serviceUrl;
    this.temporaryResolver = options.TEMPORARY_resolver;
  }

  private createObservable(
    url: string,
    definitionId?: string,
  ): Observable<ObjectState> {
    const temporaryResolver = this.temporaryResolver;
    if (temporaryResolver) {
      return merge(
        createTemporaryResolverObservable(url, temporaryResolver),
        createObjectResolverServiceObservable({
          serviceUrl: this.serviceUrl,
          objectUrl: url,
          definitionId,
        }),
      ).pipe(
        filter(state =>
          within(state.status)([
            'resolving',
            'resolved',
            'unauthorized',
            'forbidden',
          ]),
        ),
      );
    } else {
      return createObjectResolverServiceObservable({
        serviceUrl: this.serviceUrl,
        objectUrl: url,
        definitionId,
      });
    }
  }

  get(url: string, definitionId?: string): Observable<ObjectState> {
    return new Observable<ObjectState>(observer => {
      let observable = this.pool.get(url);

      if (!observable) {
        observable = this.createObservable(url, definitionId);
        this.pool.set(url, observable);
      }

      const subscription = observable.subscribe(state => {
        observer.next(state);
      });

      return () => {
        this.pool.delete(url);
        subscription.unsubscribe();
      };
    });
  }
}

export { ObjectStatus, ObjectState, AuthService };
