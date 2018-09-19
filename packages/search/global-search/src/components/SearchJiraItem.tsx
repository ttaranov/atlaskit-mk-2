import * as React from 'react';
import { JiraIcon } from '@atlaskit/logo';
import AdvancedSearchResult from './AdvancedSearchResult';
import { ADVANCED_JIRA_SEARCH_RESULT_ID } from './SearchResultsUtil';
import { AnalyticsType } from '../model/Result';

export interface Props {
  query: string;
}

export default class SearchJiraItem extends React.Component<Props> {
  render() {
    const { query } = this.props;

    return (
      <AdvancedSearchResult
        href={`/issues/?jql=${encodeURIComponent(`text ~ "${query}"`)}`}
        icon={<JiraIcon size="medium" label="Search Jira" />}
        key="search_jira"
        resultId={ADVANCED_JIRA_SEARCH_RESULT_ID}
        text="Search for more Jira issues"
        type={AnalyticsType.AdvancedSearchJira}
      />
    );
  }
}
