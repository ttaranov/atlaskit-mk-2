// @flow

import React, { type Node } from 'react';
import { Subscribe } from 'unstated';

import NavAPI from './NavAPI';

type NavAPISubscriberProps = {|
  children: NavAPI => Node,
|};

export default ({ children }: NavAPISubscriberProps) => (
  <Subscribe to={[NavAPI]}>{children}</Subscribe>
);
