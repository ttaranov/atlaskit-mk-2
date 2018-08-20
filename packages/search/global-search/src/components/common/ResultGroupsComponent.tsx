import * as React from 'react';
import { ScreenCounter } from '../../util/ScreenCounter';
import { FormattedMessage } from 'react-intl';
import ResultGroup from '../ResultGroup';
import {
  PreQueryAnalyticsComponent,
  PostQueryAnalyticsComponent,
} from './ScreenAnalyticsHelper';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import { ResultsGroup } from '../../model/Result';

export enum ResultGroupType {
  PreQuery = 'PreQuery',
  PostQuery = 'PostQuery',
}

export interface Props {
  resultsGroup: ResultsGroup[];
  type: ResultGroupType;
  renderAdvancedSearch: () => JSX.Element;
  searchSessionId: string;
  screenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

const mapGroupsToSections = (resultsToShow: ResultsGroup[]): JSX.Element[] => {
  const analyticsData = {
    resultCount: resultsToShow
      .map(({ items }) => items.length)
      .reduce((total, count) => total + count, 0),
  };

  return resultsToShow
    .filter(({ items }) => items && items.length)
    .map((group, index) => (
      <ResultGroup
        key={group.key}
        title={<FormattedMessage id={group.titleI18nId} />}
        results={group.items}
        sectionIndex={index}
        analyticsData={analyticsData}
      />
    ));
};
export default class ResultGroupsComponent extends React.Component<Props> {
  getAnalyticsComponent() {
    const {
      searchSessionId,
      screenCounter,
      referralContextIdentifiers,
      type,
    } = this.props;
    switch (type) {
      case ResultGroupType.PreQuery:
        return (
          <PreQueryAnalyticsComponent
            key="pre-query-analytics"
            screenCounter={screenCounter}
            searchSessionId={searchSessionId}
            referralContextIdentifiers={referralContextIdentifiers}
          />
        );
      case ResultGroupType.PostQuery:
        return (
          <PostQueryAnalyticsComponent
            key="post-query-analytics"
            screenCounter={screenCounter}
            searchSessionId={searchSessionId}
            referralContextIdentifiers={referralContextIdentifiers}
          />
        );
    }
  }

  render() {
    const { renderAdvancedSearch, resultsGroup } = this.props;

    return [
      ...mapGroupsToSections(resultsGroup),
      renderAdvancedSearch(),
      this.getAnalyticsComponent(),
    ];
  }
}
