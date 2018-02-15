import * as React from 'react';
import { createApp } from '../src/with-reducer/util';
import * as MVR from '../src/with-reducer/index';

const config: any = {
  initState: MVR.initState,
  reducer: MVR.reducer,
  // https://github.com/Microsoft/TypeScript/issues/18670
  render: (dispatch: (action: MVR.Action) => void, state: MVR.State) => (
    <MVR.Component dispatch={dispatch} {...state} />
  ),
  initialAction: { type: 'LOAD_COLLECTION' },
  effects: (action: MVR.Action): Promise<MVR.Action> | null => {
    switch (action.type) {
      case 'LOAD_COLLECTION':
        return new Promise<MVR.Action>((resolve, reject) => {
          provider.subscribe({
            next: collection => {
              resolve({ type: 'LOAD_COLLECTION_SUCCESS', collection });
            },
            error: err => {
              reject({ type: 'LOAD_COLLECTION_FAILURE', err });
            },
          });
        });
      default:
        return null;
    }
    // do HTTP REQUEST HERE, E.G. TO LOAD CARD METADATA
    // switch case, then
    // return promise with a new action
  },
};

const App = createApp<MVR.State, MVR.Action>(config);

export default (): React.ReactNode => <App />;
