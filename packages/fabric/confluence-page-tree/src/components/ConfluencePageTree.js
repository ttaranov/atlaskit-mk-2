// @flow
import React, { Component } from 'react';

import { TreeTable } from '../../../../elements/tree-table';
import { Contributors } from './Contributors';
import { getChildPageDetails } from '../api/confluence-client';

type Props = {
  contentId: string,
  cloudId: string,
};

export default class ConfluencePageTree extends Component<Props> {
  state = {
    isLoading: true,
  };

  componentDidMount() {
    const { contentId } = this.props;

    getChildPageDetails(contentId).then(data => {
      this.data = data;
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { contentId, cloudId } = this.props;
    const { isLoading } = this.state;

    return isLoading ? null : (
      <TreeTable
        columns={[
          props => <a href={props._links.webui}>{props.title}</a>,
          Contributors,
          props => <div>{props.lastUpdated.friendlyWhen}</div>,
        ]}
        headers={['Title', 'Contributors', 'Last Modified']}
        headerWidths={['400px', '200px', '200px']}
        data={() => this.data}
      />
    );
  }
}
