import CancelablePromise from '@jameslnewell/cancelable-promise';
import { fetch } from './fetch';

// note: I didn't use rxjs because we have no concept of complete or error callbacks and wanted to put methods on the object

interface ResolveResponse {
  meta: {
    visibility: 'public' | 'restricted' | 'other';
    access: 'granted' | 'unauthorised' | 'forbidden';
  };
  data?: {
    [name: string]: any;
  };
}

export type ObjectStatus =
  | 'resolving'
  | 'resolved'
  | 'unauthorised'
  | 'forbidden'
  | 'not-found'
  | 'errored';

export interface ObjectState {
  status: ObjectStatus;
  data?: { [name: string]: any };
}

export class ObjectStateStreamOptions {
  serviceUrl: string;
  objectUrl: string;
  callback: (state: ObjectState) => void;
}

export class ObjectStateStream {
  fetching?: CancelablePromise<void>;

  constructor(private readonly options: ObjectStateStreamOptions) {
    this.refresh();
  }

  private emit(state: ObjectState) {
    const { callback } = this.options;
    callback(state);
  }

  refresh() {
    const { serviceUrl, objectUrl } = this.options;

    // stop any in-progress requests
    if (this.fetching) {
      this.fetching.cancel();
    }

    this.emit({ status: 'resolving' });

    // perform the request
    this.fetching = fetch<ResolveResponse>('post', `${serviceUrl}/resolve`, {
      resourceUrl: encodeURI(objectUrl),
    }).then(
      json => {
        if (json === undefined) {
          this.emit({ status: 'not-found' });
          return;
        }

        switch (json.meta.access) {
          case 'forbidden':
            this.emit({ status: 'forbidden', data: json.data });
            break;

          case 'unauthorised':
            this.emit({ status: 'unauthorised', data: json.data });
            break;

          default:
            this.emit({ status: 'resolved', data: json.data });
        }
      },
      () => {
        this.emit({ status: 'errored' });
      },
    );
  }

  close() {
    // stop any in-progress requests
    if (this.fetching) {
      this.fetching.cancel();
    }
  }
}
