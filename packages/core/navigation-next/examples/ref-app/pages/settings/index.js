// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { PageView } from '../components';

export default function SettingsPage() {
  return (
    <PageView currentNavView="root/settings">
      <h1>Settings</h1>
      <Link to="/">Back</Link>
    </PageView>
  );
}
