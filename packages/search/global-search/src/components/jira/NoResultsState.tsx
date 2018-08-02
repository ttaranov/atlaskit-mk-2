import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { FormattedMessage } from 'react-intl';
import NoResults from '../NoResults';
export interface Props {
  query: string;
}

export default class NoResultsState extends React.Component<Props> {
  render() {
    const { query } = this.props;

    return [
      <NoResults key="no-results" />,
      <ResultItemGroup title="" key="advanced-search">
        .. TODO jira advanced search link
      </ResultItemGroup>,
    ];
  }
}
