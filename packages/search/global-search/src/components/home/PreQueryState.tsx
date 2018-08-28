import * as React from 'react';
import { Result } from '../../model/Result';
import { isEmpty, take } from '../SearchResultsUtil';
import ResultGroup from '../ResultGroup';

export interface Props {
  recentlyViewedItems: Result[];
  sectionIndex: number;
}

export default class PreQueryState extends React.Component<Props> {
  render() {
    const { recentlyViewedItems, sectionIndex } = this.props;
    if (isEmpty(recentlyViewedItems)) {
      return null;
    }

    return (
      <ResultGroup
        title="Recently viewed"
        key="recent"
        sectionIndex={sectionIndex}
        results={take(recentlyViewedItems, 10)}
      />
    );
  }
}
