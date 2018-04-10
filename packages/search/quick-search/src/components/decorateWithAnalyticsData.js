// @flow

import React, { Component } from 'react';
import type { ComponentType, Node } from 'react';
import { AnalyticsDecorator } from '@atlaskit/analytics';
import isReactElement from './isReactElement';
import { QS_ANALYTICS_EV_SUBMIT } from './constants';

const escapeRegexString = regexString =>
  regexString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const matchQsEvents = RegExp(`${escapeRegexString(QS_ANALYTICS_EV_SUBMIT)}`);

type Props = {
  /** Search results in the form of ResultItemGroups containing Result components */
  children: Node,
  /** Value of the search input field */
  value: string,
};

export default (WrappedQuickSearch: ComponentType<*>) =>
  class extends Component<Props> {
    static defaultProps = {
      children: [],
      value: '',
    };

    countChildren = () =>
      React.Children.toArray(this.props.children).reduce(
        (total, group) =>
          isReactElement(group)
            ? total + React.Children.count(group.props.children)
            : total,
        0,
      );

    render() {
      return (
        <AnalyticsDecorator
          matchPrivate
          match={matchQsEvents}
          data={{
            resultCount: this.countChildren(),
            queryLength: this.props.value.length,
          }}
        >
          <WrappedQuickSearch {...this.props} />
        </AnalyticsDecorator>
      );
    }
  };
