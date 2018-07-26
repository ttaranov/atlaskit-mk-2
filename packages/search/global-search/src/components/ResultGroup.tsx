import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { Result } from '../model/Result';
import ResultList from './ResultList';

export interface Props {
  title: JSX.Element;
  results: Result[];
  sectionIndex: number;
}

export default class ResultGroup extends React.Component<Props> {
  render() {
    const { title, results, sectionIndex } = this.props;

    if (results.length === 0) {
      return null;
    }

    return (
      <ResultItemGroup title={title}>
        <ResultList results={results} sectionIndex={sectionIndex} />
      </ResultItemGroup>
    );
  }
}
