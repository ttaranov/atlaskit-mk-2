import * as React from 'react';
import { ScreenCounter } from '../../util/ScreenCounter';
import { isEmpty } from '../SearchResultsUtil';
import NoRecentActivity from '../NoRecentActivity';
import ResultGroupsComponent, {
  ResultsGroup,
  ResultGroupType,
} from './ResultGroupsComponent';
import { PreQueryAnalyticsComponent } from './ScreenAnalyticsHelper';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import AdvancedSearchGroup from '../confluence/AdvancedSearchGroup';

export interface Props {
  query: string;
  resultsGroup: ResultsGroup[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
  advancedSearchLink: JSX.Element;
}

export default class PreQueryState extends React.Component<Props> {
  render() {
    const {
      resultsGroup,
      query,
      searchSessionId,
      screenCounter,
      advancedSearchLink,
      referralContextIdentifiers,
    } = this.props;

    if ((resultsGroup || []).map(({ items }) => items).every(isEmpty)) {
      return [
        <PreQueryAnalyticsComponent
          key="pre-query-analytics"
          screenCounter={screenCounter}
          searchSessionId={searchSessionId}
          referralContextIdentifiers={referralContextIdentifiers}
        />,
        <NoRecentActivity key="no-recent-activity">
          {advancedSearchLink}
        </NoRecentActivity>,
      ];
    }

    return (
      <ResultGroupsComponent
        type={ResultGroupType.PreQuery}
        renderAdvancedSearch={() => (
          <AdvancedSearchGroup key="advanced" query={query} />
        )}
        resultsGroup={resultsGroup}
        searchSessionId={searchSessionId}
        screenCounter={screenCounter}
        referralContextIdentifiers={referralContextIdentifiers}
      />
    );
  }
}
