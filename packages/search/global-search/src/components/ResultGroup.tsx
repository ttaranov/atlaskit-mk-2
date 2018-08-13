import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { Result } from '../model/Result';
import ResultList from './ResultList';

export interface Props {
  title: JSX.Element | string;
  results: Result[];
  sectionIndex: number;
  analyticsData?: {};
}

export default class ResultGroup extends React.Component<Props> {
  render() {
    const { title, results, sectionIndex } = this.props;

    if (results.length === 0) {
      return null;
    }

    return (
      <ResultItemGroup title={title}>
        <ResultList
          analyticsData={this.props.analyticsData}
          results={results}
          sectionIndex={sectionIndex}
        />
      </ResultItemGroup>
    );
  }
}
