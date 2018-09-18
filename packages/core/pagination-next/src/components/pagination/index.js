//@flow
import React, { Component, Fragment } from 'react';
import { LeftNavigator, RightNavigator } from '../navigators';

import Link from '../Link';

type Props = {
  children: Function,
};

export default class Pagination extends Component<Props> {
  render() {
    const { children } = this.props;
    return children(LeftNavigator, Link, RightNavigator);
  }
}
