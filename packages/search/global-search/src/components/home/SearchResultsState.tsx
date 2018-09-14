import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { ConfluenceIcon } from '@atlaskit/logo';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import { Result } from '../../model/Result';
import { take, isEmpty } from '../SearchResultsUtil';
import ResultList from '../ResultList';
import SearchJiraItem from '../SearchJiraItem';
import SearchConfluenceItem from '../SearchConfluenceItem';
import SearchPeopleItem from '../SearchPeopleItem';

export const MAX_PAGES_BLOGS_ATTACHMENTS = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;

export interface Props {
  query: string;
  recentResults: Result[];
  jiraResults: Result[];
  confluenceResults: Result[];
  peopleResults: Result[];
}

export default class SearchResultsState extends React.Component<Props> {
  render() {
    const {
      query,
      recentResults,
      jiraResults,
      confluenceResults,
      peopleResults,
    } = this.props;

    let sectionIndex = 0;

    const recentGroup = !isEmpty(recentResults) ? (
      <ResultItemGroup title="Recently viewed" key="recent">
        <ResultList
          results={take(recentResults, 5)}
          sectionIndex={sectionIndex++}
        />
      </ResultItemGroup>
    ) : null;

    const jiraGroup = (
      <ResultItemGroup title="Jira issues" key="jira">
        <ResultList
          results={take(jiraResults, 5)}
          sectionIndex={sectionIndex++}
        />
        <SearchJiraItem query={query} />
      </ResultItemGroup>
    );

    const confluenceGroup = (
      <ResultItemGroup title="Confluence pages and blogs" key="confluence">
        <ResultList
          results={take(confluenceResults, 5)}
          sectionIndex={sectionIndex++}
        />
        <SearchConfluenceItem
          query={query}
          text="Search for more Confluence pages and blogs"
          icon={<ConfluenceIcon size="medium" label="Search confluence" />}
        />
      </ResultItemGroup>
    );

    const peopleGroup = (
      <ResultItemGroup title="People" key="people">
        <ResultList
          results={take(peopleResults, 3)}
          sectionIndex={sectionIndex++}
        />
        <SearchPeopleItem
          query={query}
          text="Search for more people"
          icon={<PeopleIcon size="medium" label="Search people" />}
        />
      </ResultItemGroup>
    );

    return [recentGroup, jiraGroup, confluenceGroup, peopleGroup];
  }
}
