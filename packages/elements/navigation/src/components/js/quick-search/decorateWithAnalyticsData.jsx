import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AnalyticsDecorator } from '@atlaskit/analytics';
import isReactElement from './isReactElement';
import { QS_ANALYTICS_EV_SUBMIT } from './constants';

const escapeRegexString = (regexString) => regexString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const matchQsEvents = RegExp(`${escapeRegexString(QS_ANALYTICS_EV_SUBMIT)}`);

export default (WrappedQuickSearch) =>
  class extends Component {
    static propTypes = {
      /** Search results in the form of AkNavigationItemGroups containing Result components */
      children: PropTypes.node,
      /** Value of the search input field */
      value: PropTypes.string,
    }

    static defaultProps = {
      children: [],
      value: '',
    }

    countChildren = () => React.Children
      .toArray(this.props.children)
      .reduce(
        (total, group) => (isReactElement(group)
          ? (total + React.Children.count(group.props.children))
          : total
        )
      , 0);

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
