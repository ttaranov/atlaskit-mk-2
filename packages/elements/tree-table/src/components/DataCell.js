// @flow
import React from 'react';
import { DataCell } from '../styled';
import withColumnWidth from './withColumnWidth';

export default withColumnWidth(props => (
  <DataCell {...props}>{props.children}</DataCell>
));
