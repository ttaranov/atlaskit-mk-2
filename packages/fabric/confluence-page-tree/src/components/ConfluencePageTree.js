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
import { getChildPageDetails } from '../api/confluence';
import { getI18n } from '../i18n-text';

type Props = {
  contentId: string,
  cloudId: string,
};

type State = {
  isLoading: boolean,
  errorType?: 'error' | 'noaccess' | 'none' | null,
};

export default class ConfluencePageTree extends Component<Props, State> {
  state = {
    isLoading: true,
    errorType: null,
  };

  data = null;

  componentDidMount() {
    const { contentId } = this.props;

    getChildPageDetails(contentId)
      .then(data => {
        this.data = data;

        this.data.length === 0
          ? this.setState(() => ({
              isLoading: false,
              errorType: 'none',
            }))
          : this.setState({
              isLoading: false,
            });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          errorType: 'error',
        });
      });
  }

  render() {
    const { cloudId } = this.props;
    const { isLoading, errorType } = this.state;
    const hasData = true;

    return isLoading ? null : (
      <TreeTable>
        <HeadersRow>
          <Header width={'30%'}>{getI18n().tableHeaderTitle}</Header>
          <Header width={'30%'}>{getI18n().tableHeaderContributors}</Header>
          <Header width={'30%'}>{getI18n().tableHeaderLastModified}</Header>
        </HeadersRow>
        {hasData ? (
          <TreeRows
            data={({ id = this.props.contentId } = {}) =>
              getChildPageDetails(id)
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
        ) : (
          <ErrorTree type={errorType} />
        )}
      </TreeTable>
    );
  }
}
