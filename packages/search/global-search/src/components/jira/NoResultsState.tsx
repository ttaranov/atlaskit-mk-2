import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import NoResults from '../NoResults';
export interface Props {
  query: string;
}

export default class NoResultsState extends React.Component<Props> {
  render() {
    const { query } = this.props;

    // TODO i18n messages.
    // TODO advanced search link
    return [
      <NoResults key="no-results" title="TODO title" body="TODO body" />,
      <ResultItemGroup title="" key="advanced-search">
        .. TODO jira advanced search link
      </ResultItemGroup>,
    ];
  }
}
