// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { SetNavView, Page } from '../components';

export default function SettingsPage() {
  return (
    <Page>
      <SetNavView id="root/settings" />
      <h1>Settings</h1>
      <Link to="/">Back</Link>
    </Page>
  );
}
