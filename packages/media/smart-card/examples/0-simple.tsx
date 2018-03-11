import * as React from 'react';
import { Provider, Card } from '../src';

export default () => (
  <Provider>
    <div>
      <p>Oh look 👀, here's a smart card 👇 </p>
      <br />
      <Card url="https://trello.com/c/CbrzZIQ2/45-1878-piedmont-ave-former-bank-now-inkaholiks-pringle-and-smith" />
    </div>
  </Provider>
);
