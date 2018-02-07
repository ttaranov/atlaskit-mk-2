import * as React from 'react';
import { createApp } from '../src/with-reducer/util';
import * as MVR from '../src/with-reducer/index';

const App = createApp<MVR.State, MVR.Action>({
  initState: MVR.initState,
  reducer: MVR.reducer,
  // https://github.com/Microsoft/TypeScript/issues/18670
  render: (dispatch: (action: MVR.Action) => void, state: MVR.State) => (
    <MVR.Component dispatch={dispatch} {...state} />
  ),
});

export default (): React.ReactNode => <App />;
