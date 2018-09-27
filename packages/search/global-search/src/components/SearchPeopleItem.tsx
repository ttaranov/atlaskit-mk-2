import * as React from 'react';
import AdvancedSearchResult from './AdvancedSearchResult';
import { ADVANCED_PEOPLE_SEARCH_RESULT_ID } from './SearchResultsUtil';
import { AnalyticsType } from '../model/Result';

export interface Props {
  query: string;
  text: JSX.Element | string;
  icon?: JSX.Element;
  analyticsData?: object;
  isCompact?: boolean;
}

export default class SearchPeopleItem extends React.Component<Props> {
  render() {
    const { query, icon, text, analyticsData, isCompact } = this.props;

    return (
      <AdvancedSearchResult
        href={`/people/search?q=${encodeURIComponent(query)}`}
        icon={icon}
        key="search_people"
        analyticsData={analyticsData}
        resultId={ADVANCED_PEOPLE_SEARCH_RESULT_ID}
        text={text}
        type={AnalyticsType.AdvancedSearchPeople}
        target="_blank"
        isCompact={isCompact}
      />
    );
  }
}
