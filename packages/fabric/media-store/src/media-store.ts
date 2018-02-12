import { AuthProvider, AuthContext } from './models/auth-provider';
import { Auth } from './models/auth';
import { mapAuthToQueryParameters } from './models/auth-query-parameters';
import { URLSearchParams } from 'url';

export interface MediaStoreConfig {
  readonly apiUrl: string;
  readonly authProvider: AuthProvider;
}

export interface MediaStoreResponse<Data> {
  readonly data: Data;
}

export interface MediaStoreCollection {
  readonly name: string;
  readonly createdAt: number;
}

export class MediaStore {
  constructor(private readonly config: MediaStoreConfig) {}

  createCollection(
    name: string,
  ): Promise<MediaStoreResponse<MediaStoreCollection>> {
    const url = `${this.config.apiUrl}/collection`;
    const body = {
      name,
    };

    return this.fetch('POST', '/collection', {}, body).then(mapResponseToJson);
  }

  getCollection(
    name: string,
  ): Promise<MediaStoreResponse<MediaStoreCollection>> {
    return Promise.reject('not implemented yet');
  }

  deleteCollection(name: string): Promise<void> {
    return Promise.reject('not implemented yet');
  }

  private fetch(
    method: Method,
    path: string,
    authContext: AuthContext,
    body?: any,
  ): Promise<Response> {
    return this.config.authProvider(authContext).then(auth =>
      fetch(`${this.config.apiUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
  }

  private withAuth = (auth: Auth) => (request: Request): Request => {
    if (request.method === 'GET') {
      const url = new URL(request.url);
      const authParams = mapAuthToQueryParameters(auth);

      Object.keys(authParams).forEach(name =>
        url.searchParams.set(name, authParams[name]),
      );

      return request;
    } else {
      return request;
    }
  };
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const mapResponseToJson = (response: Response): Promise<any> => response.json();
