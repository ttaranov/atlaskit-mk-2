// @flow

import React from 'react';
import { SetNavView, Page } from '../components';

export default function SettingsPage() {
  return (
    <Page>
      <SetNavView id="root/home" />
      <h1>Home</h1>
    </Page>
  );
}
