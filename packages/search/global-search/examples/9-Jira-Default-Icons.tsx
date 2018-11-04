import * as React from 'react';
import { ObjectResult as ObjectResultComponent } from '@atlaskit/quick-search';
import { getDefaultAvatar } from '../src/util/jira-avatar-util';
import { ContentType } from '../src/model/Result';

export default class extends React.Component {
  render() {
    return (
      <>
        <ObjectResultComponent
          key="issue-key"
          resultId="issue-id"
          name="jira-issue"
          href="http://www.example.com"
          objectKey="TEST-1"
          containerName="board"
          avatar={getDefaultAvatar(ContentType.JiraIssue)}
        />
        <ObjectResultComponent
          key="board-key"
          resultId="board-id"
          name="jira-board"
          href="http://www.example.com"
          objectKey="Board"
          containerName="project"
          avatar={getDefaultAvatar(ContentType.JiraBoard)}
        />
        <ObjectResultComponent
          key="filter-key"
          resultId="filter-id"
          name="jira-filter"
          href="http://www.example.com"
          objectKey="Filter"
          containerName="Project"
          avatar={getDefaultAvatar(ContentType.JiraFilter)}
        />
      </>
    );
  }
}
