import * as React from 'react';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { akTypographyMixins } from '@atlaskit/util-shared-styles';

import { Result } from '../../model/Result';
import { isEmpty, getConfluenceAdvancedSearchLink } from '../SearchResultsUtil';
import NoRecentActivity from '../NoRecentActivity';
import RecentActivities from './RecentActivities';
import { ScreenCounter } from '../../util/ScreenCounter';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

export interface Props {
  query: string;
  recentlyViewedPages: Result[];
  recentlyViewedSpaces: Result[];
  recentlyInteractedPeople: Result[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
}

class ConfluenceNoRecentActivity extends React.Component {
  render() {
    return (
      <NoRecentActivity>
        <FormattedHTMLMessage
          id="global-search.no-recent-activity-body"
          values={{ url: getConfluenceAdvancedSearchLink() }}
        />
      </NoRecentActivity>
    );
  }
}

export default class PreQueryState extends React.Component<Props> {
  render() {
    const {
      recentlyInteractedPeople,
      recentlyViewedPages,
      recentlyViewedSpaces,
      query,
      searchSessionId,
      screenCounter,
    } = this.props;

    if (
      [
        recentlyInteractedPeople,
        recentlyViewedPages,
        recentlyViewedSpaces,
      ].every(isEmpty)
    ) {
      return <ConfluenceNoRecentActivity />;
    }

    return (
      <RecentActivities
        query={query}
        recentlyViewedPages={recentlyViewedPages}
        recentlyViewedSpaces={recentlyViewedSpaces}
        recentlyInteractedPeople={recentlyInteractedPeople}
        searchSessionId={searchSessionId}
        screenCounter={screenCounter}
      />
    );
  }
}
