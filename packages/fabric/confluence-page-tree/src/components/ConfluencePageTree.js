// @flow
import React, { Component } from 'react';

import {
  TreeTable,
  TreeHeads,
  TreeHead,
  TreeRows,
  RowData,
  TreeCell,
} from '../../../../elements/tree-table';
import { Contributors } from './Contributors';
import { getChildPageDetails } from '../api/confluence';

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

    return isLoading ? null : (
      <TreeTable>
        <TreeHeads>
          <TreeHead width={300}>Title</TreeHead>
          <TreeHead width={300}>Contributors</TreeHead>
          <TreeHead width={300}>Last Modified</TreeHead>
        </TreeHeads>
        <TreeRows
          data={() => this.data}
          render={({
            id,
            title,
            contributors,
            lastUpdated,
            childTypes,
            _links,
          }) => (
            <RowData key={id} hasChildren={childTypes.page.value}>
              <TreeCell width={300}>
                <a href={_links.webui}>{title}</a>
              </TreeCell>
              <TreeCell width={300}>
                <Contributors cloudId={cloudId} contributors={contributors} />
              </TreeCell>
              <TreeCell width={300}>
                <div>{lastUpdated.friendlyWhen}</div>
              </TreeCell>
            </RowData>
          )}
        />
      </TreeTable>
    );
  }
}
