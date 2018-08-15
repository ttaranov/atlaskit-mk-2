import * as React from 'react';
import { Result } from '../../model/Result';
import { ScreenCounter } from '../../util/ScreenCounter';
import { FormattedMessage } from 'react-intl';
import ResultGroup from '../ResultGroup';
import { PreQueryAnalyticsComponent } from './ScreenAnalyticsHelper';
import AdvancedSearchGroup from '../confluence/AdvancedSearchGroup';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';

export interface Props {
  query: string;
  resultsGroup: ResultsGroup[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

export type ResultsGroup = {
  items: Result[];
  key: string;
  titleI18nId: string;
};

const mapRecentlyViewedObjectsToSections = (resultsToShow: ResultsGroup[]) => {
  const analyticsData = {
    resultCount: resultsToShow
      .map(({ items }) => items.length)
      .reduce((total, count) => total + count, 0),
  };

  return resultsToShow.map((result, index) => (
    <ResultGroup
      key={result.key}
      title={<FormattedMessage id={result.titleI18nId} />}
      results={result.items}
      sectionIndex={index}
      analyticsData={analyticsData}
    />
  ));
};
export default class RecentActivities extends React.Component<Props> {
  render() {
    const {
      query,
      searchSessionId,
      screenCounter,
      resultsGroup,
      referralContextIdentifiers,
    } = this.props;

    return [
      ...mapRecentlyViewedObjectsToSections(resultsGroup),
      <AdvancedSearchGroup key="advanced" query={query} />,
      <PreQueryAnalyticsComponent
        key="pre-query-analytics"
        screenCounter={screenCounter}
        searchSessionId={searchSessionId}
        referralContextIdentifiers={referralContextIdentifiers}
      />,
    ];
  }
}
