// @flow
import React from 'react';
import { Cell } from '../styled';
import withColumnWidth from './withColumnWidth';

export default withColumnWidth(props => (
  <Cell {...props}>{props.children}</Cell>
));
