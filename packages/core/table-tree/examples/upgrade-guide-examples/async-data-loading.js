// @flow

import React, { Component } from 'react';
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
  toTableTreeData,
} from '../../src';

type State = {
  rootIds: Array<number | string>,
  itemsById: Object,
};

class WithStaticData extends Component<{}, State> {
  state = {
    rootIds: [],
    itemsById: {},
  };

  componentDidMount() {
    this.loadChildFor();
  }

  loadChildFor = (parentItem: ?Object) => {
    getChildren(parentItem).then(item => {
      this.setState({
        ...toTableTreeData(item, parentItem, this.state.itemsById, {
          keyId: 'title',
        }),
      });
    });
  };

  render() {
    const { itemsById, rootIds } = this.state;
    return (
      <TableTree>
        <Headers>
          <Header width={300}>Chapter title</Header>
          <Header width={100}>Numbering</Header>
          <Header width={100}>Page</Header>
        </Headers>
        <Rows
          rootItems={rootIds && rootIds.map(rootId => itemsById[rootId])}
          render={({ title, numbering, page, hasChildren, childIds }) => (
            <Row
              onExpand={this.loadChildFor}
              expandLabel={'Expand'}
              collapseLabel={'Collapse'}
              itemId={numbering}
              childItems={childIds && childIds.map(id => itemsById[id])}
              hasChildren={hasChildren}
            >
              <Cell singleLine>{title}</Cell>
              <Cell singleLine>{numbering}</Cell>
              <Cell singleLine>{page}</Cell>
            </Row>
          )}
        />
      </TableTree>
    );
  }
}

const getChildren = (parentItem: ?Object) => {
  if (!parentItem) {
    return Promise.resolve([
      {
        id: 'title One',
        title: 'title One',
        numbering: '1',
        page: '1',
        hasChildren: true,
      },
    ]);
  }
  return Promise.resolve([
    {
      id: `${parentItem.id}: child`,
      title: `${parentItem.title}: child`,
      numbering: `${parentItem.numbering}.1`,
      page: '1',
      hasChildren: true,
    },
  ]);
};

export default () => <WithStaticData />;
