// @flow

import React, { Fragment } from 'react';

import { GroupHeading, Separator } from '../../';
import type { GroupProps } from './types';

export default ({ children, hasSeparator, heading }: GroupProps) => {
  return React.Children.count(children) ? (
    <Fragment>
      {heading ? <GroupHeading>{heading}</GroupHeading> : null}
      {children}
      {hasSeparator && <Separator />}
    </Fragment>
  ) : null;
};
