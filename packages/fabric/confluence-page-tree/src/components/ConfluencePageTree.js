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

type Props = {
  contentId: string,
  cloudId: string,
};

type State = {
  errorState?: 'error' | 'noaccess' | 'empty' | null,
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
          <Header width={'30%'}>{getI18n().tableHeaderTitle}</Header>
          <Header width={'30%'}>{getI18n().tableHeaderContributors}</Header>
          <Header width={'30%'}>{getI18n().tableHeaderLastModified}</Header>
        </HeadersRow>
        {errorState ? (
          <ErrorTree type={errorState} />
        ) : (
          <TreeRows
            data={({ id = contentId } = {}) =>
              contentId === id
                ? getChildren(id)
                    .then(result => {
                      let newErrorState;

                      result.length === 0
                        ? (newErrorState = 'empty')
                        : (newErrorState = null);
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
                <DataCell width={'30%'}>
                  <a href={_links.webui}>{title}</a>
                </DataCell>
                <DataCell width={'30%'}>
                  <Contributors cloudId={cloudId} contributors={contributors} />
                </DataCell>
                <DataCell width={'30%'}>
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
