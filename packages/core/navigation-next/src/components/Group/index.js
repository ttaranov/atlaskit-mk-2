// @flow

import React, { Component } from 'react';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import { GroupHeading, Separator } from '../../';
import type { GroupProps } from './types';

export default class Group extends Component<GroupProps> {
  static defaultProps = {
    hasSeparator: false,
  };

  render() {
    const { children, hasSeparator, heading } = this.props;

    return React.Children.count(children) ? (
      <NavigationAnalyticsContext
        data={{
          attributes: {
            viewGroup:
              typeof heading === 'string' ? heading : JSON.stringify(heading),
          },
          componentName: 'Group',
        }}
      >
        {heading && <GroupHeading>{heading}</GroupHeading>}
        {children}
        {hasSeparator && <Separator />}
      </NavigationAnalyticsContext>
    ) : null;
  }
}
