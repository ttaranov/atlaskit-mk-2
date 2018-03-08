import * as React from 'react';
import styled from 'styled-components';
import { SmartCard, SmartCardClient, SmartCardProvider } from '../src';

const client = new SmartCardClient({
  // baseUrl: 'https://a-different-environment/'
});

export default () => (
  <SmartCardProvider client={client}>
    <div>
      <p>Oh look 👀, here's a smart card 👇 </p>
      <br />
      <SmartCard url="https://trello.com/c/CbrzZIQ2/45-1878-piedmont-ave-former-bank-now-inkaholiks-pringle-and-smith" />
      <br />

      <div
        style={{ height: '3000px', display: 'flex', alignItems: 'flex-start' }}
      >
        <p>Oh look 👀 there's a lazily loaded one just a bit further down 👇</p>
      </div>
      <SmartCard url="https://trello.com/b/8B5zyiSn/test-smart-card-board" />
    </div>
  </SmartCardProvider>
);
