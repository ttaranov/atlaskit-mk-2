import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ResultBase } from '@atlaskit/quick-search';
import { gridSize } from '@atlaskit/theme';
import SearchIcon from '@atlaskit/icon/glyph/search';
import styled from 'styled-components';
import { messages } from '../../messages';
import Return from '../../assets/Return';
import { AnalyticsType } from '../../model/Result';

const Wrapper = styled.div`
  padding: ${gridSize()}px 0;
`;

export default class AdvancedIssueSearchLink extends React.Component {
  render() {
    return (
      <Wrapper>
        <ResultBase
          href="/issues"
          resultId="jira-advanced-issue-search"
          text={<FormattedMessage {...messages.jira_advanced_issue_search} />}
          icon={<SearchIcon size="medium" label="Advanced search" />}
          type={AnalyticsType.TopLinkPreQueryAdvancedSearchJira}
          elemAfter={<Return />}
        />
      </Wrapper>
    );
  }
}
