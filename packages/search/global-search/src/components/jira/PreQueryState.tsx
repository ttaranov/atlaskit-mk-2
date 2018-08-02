import * as React from 'react';
import { Result } from '../../model/Result';
import { ScreenCounter } from './JiraSearchResults';
import { isEmpty, getConfluenceAdvancedSearchLink } from '../SearchResultsUtil';
import NoRecentActivity from '../NoRecentActivity';
import RecentActivities from './RecentActivities';

export interface Props {
  query: string;
  recentObjects: Result[];
  recentContainers: Result[];
  recentlyInteractedPeople: Result[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
}

export default class PreQueryState extends React.Component<Props> {
  render() {
    const {
      recentObjects,
      recentContainers,
      recentlyInteractedPeople,
      query,
      searchSessionId,
      screenCounter,
    } = this.props;

    if (
      [recentObjects, recentContainers, recentlyInteractedPeople].every(isEmpty)
    ) {
      return (
        <NoRecentActivity
          // TODO jira advanced link
          advancedSearchUrl={getConfluenceAdvancedSearchLink()}
        />
      );
    }

    return (
      <RecentActivities
        query={query}
        recentObjects={recentObjects}
        recentContainers={recentContainers}
        recentlyInteractedPeople={recentlyInteractedPeople}
        searchSessionId={searchSessionId}
        screenCounter={screenCounter}
      />
    );
  }
}
