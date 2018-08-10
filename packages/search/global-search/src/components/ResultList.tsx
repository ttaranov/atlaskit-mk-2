import * as React from 'react';
import {
  ObjectResult as ObjectResultComponent,
  PersonResult as PersonResultComponent,
  ContainerResult as ContainerResultComponent,
} from '@atlaskit/quick-search';
import {
  Result,
  ContainerResult,
  JiraObjectResult,
  PersonResult,
  ResultType,
  ConfluenceObjectResult,
} from '../model/Result';
import { getAvatarForConfluenceObjectResult } from '../util/confluence-avatar-util';

export interface Props {
  results: Result[];
  sectionIndex: number;
  analyticsData?: {};
}

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
      };

      switch (resultType) {
        case ResultType.ConfluenceObjectResult: {
          const confluenceResult = result as ConfluenceObjectResult;

          return (
            <ObjectResultComponent
              key={confluenceResult.resultId}
              resultId={confluenceResult.resultId}
              name={confluenceResult.name}
              href={confluenceResult.href}
              type={confluenceResult.analyticsType}
              contentType={confluenceResult.contentType}
              containerName={confluenceResult.containerName}
              avatar={getAvatarForConfluenceObjectResult(confluenceResult)}
              analyticsData={{
                ...analyticsData,
                contentType: confluenceResult.contentType,
              }}
            />
          );
        }
        case ResultType.JiraObjectResult: {
          const jiraResult = result as JiraObjectResult;

          return (
            <ObjectResultComponent
              key={jiraResult.resultId}
              resultId={jiraResult.resultId}
              name={jiraResult.name}
              href={jiraResult.href}
              type={jiraResult.analyticsType}
              objectKey={jiraResult.objectKey}
              containerName={jiraResult.containerName}
              avatarUrl={jiraResult.avatarUrl}
              analyticsData={analyticsData}
            />
          );
        }
        case ResultType.GenericContainerResult: {
          const containerResult = result as ContainerResult;

          return (
            <ContainerResultComponent
              key={containerResult.resultId}
              resultId={containerResult.resultId}
              name={containerResult.name}
              href={containerResult.href}
              type={containerResult.analyticsType}
              avatarUrl={containerResult.avatarUrl}
              analyticsData={analyticsData}
            />
          );
        }
        case ResultType.PersonResult: {
          const personResult = result as PersonResult;

          return (
            <PersonResultComponent
              key={personResult.resultId}
              resultId={personResult.resultId}
              name={personResult.name}
              href={personResult.href}
              type={personResult.analyticsType}
              avatarUrl={personResult.avatarUrl}
              mentionName={personResult.mentionName}
              presenceMessage={personResult.presenceMessage}
              analyticsData={analyticsData}
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
