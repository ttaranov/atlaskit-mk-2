// @flow
import React, { Component } from 'react';
import TreeTable, {
  TreeHeads,
  TreeHead,
  TreeRows,
  RowData,
  TreeCell,
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
};

export default class ConfluencePageTree extends Component<Props, State> {
  state = {
    isLoading: true,
  };

  data = null;

  componentDidMount() {
    const { contentId } = this.props;

    getChildPageDetails(contentId).then(data => {
      this.data = data;
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { cloudId } = this.props;
    const { isLoading } = this.state;
    const hasData = true;

    return isLoading ? null : (
      <TreeTable>
        <TreeHeads>
          <TreeHead width={'30%'}>{getI18n().tableHeaderTitle}</TreeHead>
          <TreeHead width={'30%'}>{getI18n().tableHeaderContributors}</TreeHead>
          <TreeHead width={'30%'}>{getI18n().tableHeaderLastModified}</TreeHead>
        </TreeHeads>
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
                <TreeCell width={'30%'}>
                  <a href={_links.webui}>{title}</a>
                </TreeCell>
                <TreeCell width={'30%'}>
                  <Contributors cloudId={cloudId} contributors={contributors} />
                </TreeCell>
                <TreeCell width={'30%'}>
                  <div>{lastUpdated.friendlyWhen}</div>
                </TreeCell>
              </RowData>
            )}
          />
        ) : (
          <ErrorTree type={'none'} />
        )}
      </TreeTable>
    );
  }
}
