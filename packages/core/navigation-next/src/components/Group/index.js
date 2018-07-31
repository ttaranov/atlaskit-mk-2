// @flow

import React, { Component, Fragment } from 'react';

import { GroupHeading, Separator } from '../../';
import type { GroupProps } from './types';

export default class Group extends Component<GroupProps> {
  static defaultProps = {
    hasSeparator: false,
  };

  render() {
    const { children, hasSeparator, heading } = this.props;

    return React.Children.count(children) ? (
      <Fragment>
        {heading && <GroupHeading>{heading}</GroupHeading>}
        {children}
        {hasSeparator && <Separator />}
      </Fragment>
    ) : null;
  }
}
