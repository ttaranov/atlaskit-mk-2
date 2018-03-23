import * as React from 'react';
import { Provider, Card } from '../src';

export default () => (
  <Provider>
    <div>
      <p>Uh oh this card errored ☠️</p>
      <Card url="https://trello.com/foo/bar" />
    </div>
  </Provider>
);
