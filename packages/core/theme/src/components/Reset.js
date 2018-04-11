// @flow

import React from 'react';
import Context from './Context';
import { N0, DN30 } from '../colors';

export default () => (
  <Context.Consumer>
    {theme => (
      <style>{`body{background:${theme.mode === 'light' ? N0 : DN30}}`}</style>
    )}
  </Context.Consumer>
);
