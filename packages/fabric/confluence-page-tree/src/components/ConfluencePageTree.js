// @flow

import React, { Component } from 'react';
import TreeTable, {
  HeadersRow,
  Header,
  TreeRows,
  RowData,
  DataCell,
} from '../../../../elements/tree-table/src';
import { Contributors } from './Contributors';
import { ErrorTree } from './ErrorTree';
import { getChildren } from '../api/confluence';
import { getI18n } from '../i18n-text';
import type { ErrorTypes } from '../types';

type Props = {
  contentId: string,
  cloudId: string,
};

type State = {
  errorState: ErrorTypes,
};

export default class ConfluencePageTree extends Component<Props, State> {
  state = {
    errorState: null,
  };

  render() {
    const { cloudId, contentId } = this.props;
    const { errorState } = this.state;

    return (
      <TreeTable>
        <HeadersRow>
          <Header width={'33%'}>{getI18n().tableHeaderTitle}</Header>
          <Header width={'33%'}>{getI18n().tableHeaderContributors}</Header>
          <Header width={'33%'}>{getI18n().tableHeaderLastModified}</Header>
        </HeadersRow>
        {errorState ? (
          <ErrorTree type={errorState} />
        ) : (
          <TreeRows
            data={({ id = contentId } = {}) =>
              contentId === id
                ? getChildren(id)
                    .then(result => {
                      const newErrorState =
                        result.length === 0 ? 'empty' : null;

                      this.setState({ errorState: newErrorState });
                      return result;
                    })
                    .catch(() => {
                      this.setState({ errorState: 'error' });
                    })
                : getChildren(id)
            }
            render={({
              id,
              title,
              contributors,
              lastUpdated,
              childTypes,
              _links,
            }) => (
              <RowData key={id} hasChildren={childTypes.page.value}>
                <DataCell>
                  <a href={_links.webui}>{title}</a>
                </DataCell>
                <DataCell>
                  <Contributors cloudId={cloudId} contributors={contributors} />
                </DataCell>
                <DataCell>
                  <div>{lastUpdated.friendlyWhen}</div>
                </DataCell>
              </RowData>
            )}
          />
        )}
      </TreeTable>
    );
  }
}
