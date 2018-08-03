import * as React from 'react';
import { Result } from '../../model/Result';
import { isEmpty } from '../SearchResultsUtil';
import NoRecentActivity from '../NoRecentActivity';
import RecentActivities from './RecentActivities';
import { ScreenCounter } from '../../util/ScreenCounter';

export interface Props {
  query: string;
  recentObjects: Result[];
  recentContainers: Result[];
  recentlyInteractedPeople: Result[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
}

class JiraNoRecentActivity extends React.Component {
  render() {
    return (
      <NoRecentActivity>
        <p>TODO blabla text and advanced search dropdown</p>
      </NoRecentActivity>
    );
  }
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
      return <JiraNoRecentActivity />;
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
