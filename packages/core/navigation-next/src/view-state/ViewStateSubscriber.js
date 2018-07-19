// @flow

import React, { type Node } from 'react';
import { Subscribe } from 'unstated';

import ViewState from './ViewState';

type Props = {|
  children: ViewState => Node,
|};

export default (props: Props) => <Subscribe to={[ViewState]} {...props} />;
