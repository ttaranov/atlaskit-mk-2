// @flow
import React from 'react';
import { Header } from '../styled';
import withColumnWidth from './withColumnWidth';

export default withColumnWidth(props => (
  <Header {...props}>{props.children}</Header>
));
