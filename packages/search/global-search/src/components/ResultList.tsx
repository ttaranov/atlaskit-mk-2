import * as React from 'react';
import {
  ObjectResult as ObjectResultComponent,
  PersonResult as PersonResultComponent,
  ContainerResult as ContainerResultComponent,
} from '@atlaskit/quick-search';
import {
  Result,
  ContainerResult,
  JiraResult,
  PersonResult,
  ResultType,
  ConfluenceObjectResult,
} from '../model/Result';
import { getAvatarForConfluenceObjectResult } from '../util/confluence-avatar-util';
import { getDefaultAvatar } from '../util/jira-avatar-util';
import WithSelectedIcon from './common/WithSelectedIcon';
import Return from '../assets/Return';
import { ResultBase } from './types/ResultBase';

export interface Props {
  results: Result[];
  sectionIndex: number;
  analyticsData?: {};
}

const withReturnIconWhenSelected = WithSelectedIcon<ResultBase>(<Return />);
const ObjectResultWithSelectedState = withReturnIconWhenSelected(
  ObjectResultComponent,
);

const extractAvatarData = (jiraResult: JiraResult) =>
  jiraResult.avatarUrl
    ? { avatarUrl: jiraResult.avatarUrl }
    : {
        avatar: getDefaultAvatar(jiraResult.contentType),
      };

export default class ResultList extends React.Component<Props> {
  render() {
    const { results, sectionIndex } = this.props;

    return results.map((result, index) => {
      const resultType: ResultType = result.resultType;
      const analyticsData = {
        sectionIndex,
        indexWithinSection: index,
        containerId: result.containerId,
        experimentId: result.experimentId,
        ...this.props.analyticsData,
        contentType: result.contentType,
      };
      const resultKey = `${result.contentType || 'result'}-${
        result.resultId
      }-${index + 1}`;
      switch (resultType) {
        case ResultType.ConfluenceObjectResult: {
          const confluenceResult = result as ConfluenceObjectResult;
          return (
            <ObjectResultWithSelectedState
              key={resultKey}
              resultId={confluenceResult.resultId}
              name={confluenceResult.name}
              href={confluenceResult.href}
              type={confluenceResult.analyticsType}
              contentType={confluenceResult.contentType}
              containerName={confluenceResult.containerName}
              avatar={getAvatarForConfluenceObjectResult(confluenceResult)}
              analyticsData={analyticsData}
            />
          );
        }
        case ResultType.JiraObjectResult: {
          const jiraResult = result as JiraResult;
          const avatarData = extractAvatarData(jiraResult);
          return (
            <ObjectResultComponent
              key={resultKey}
              resultId={jiraResult.resultId}
              name={jiraResult.name}
              href={jiraResult.href}
              type={jiraResult.analyticsType}
              objectKey={jiraResult.objectKey}
              containerName={jiraResult.containerName}
              {...avatarData}
              contentType={jiraResult.contentType}
              analyticsData={analyticsData}
            />
          );
        }
        case ResultType.GenericContainerResult: {
          const containerResult = result as ContainerResult;

          return (
            <ContainerResultComponent
              key={resultKey}
              resultId={containerResult.resultId}
              name={containerResult.name}
              href={containerResult.href}
              type={containerResult.analyticsType}
              avatarUrl={containerResult.avatarUrl}
              contentType={containerResult.contentType}
              analyticsData={analyticsData}
            />
          );
        }
        case ResultType.PersonResult: {
          const personResult = result as PersonResult;

          return (
            <PersonResultComponent
              key={resultKey}
              resultId={personResult.resultId}
              name={personResult.name}
              href={personResult.href}
              type={personResult.analyticsType}
              avatarUrl={personResult.avatarUrl}
              mentionName={personResult.mentionName}
              presenceMessage={personResult.presenceMessage}
              analyticsData={analyticsData}
              target="_blank"
            />
          );
        }
        default: {
          // Make the TS compiler verify that all enums have been matched
          const _nonExhaustiveMatch: never = resultType;
          throw new Error(
            `Non-exhaustive match for result type: ${_nonExhaustiveMatch}`,
          );
        }
      }
    });
  }
}
