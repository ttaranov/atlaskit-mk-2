// @flow
import React, { PureComponent } from 'react';
import TreeTable, {
  HeadersRow,
  Header,
  TreeRows,
  RowData,
  DataCell,
} from '../src';
import staticData from './data-freeform-nodes.json';

function fetchRoots() {
  return Promise.resolve(staticData.children);
}

function fetchChildrenOf(node) {
  return Promise.resolve(node.children);
}

function fetchRows(parent) {
  return parent ? fetchChildrenOf(parent) : fetchRoots();
}

const TREE_UPDATED = 'TREE_UPDATED';

class ReduxConnectedTree extends PureComponent {
  constructor() {
    super();
    this.state = {
      treeData: null,
      treeNodes: {
        byId: {},
      },
      onDataRequested: this.onDataRequested.bind(this),
    };
  }

  onDataRequested(parentRow) {
    fetchRows(parentRow).then(rows => {
      const action = treeUpdatedAction({ parentRow, childRows: rows });
      this.setState(reducer(this.state, action));
    });
  }

  render() {
    return (
      <ReduxStatelessTree
        treeData={this.state.treeData}
        onDataRequested={this.state.onDataRequested}
      />
    );
  }
}

function treeUpdatedAction({ parentRow, childRows }) {
  return {
    type: TREE_UPDATED,
    parentRow,
    childRows,
  };
}

function reducer(state, action) {
  switch (action) {
    case TREE_ROOT_ROWS_FETCHED:
      break;
    case TREE_CHILD_ROWS_FETCHED:
      break;

    case TREE_UPDATED:
      return {
        ...state,
        treeNodes: {
          rootNodes: [],
          byId: {
            ...state.treeNodes.byId,
            [action.parentRow.id]: {
              ...action.parentRow,
              children: action.childRows.map(row => row.id),
            },
            ...arrayToObject(action.childRows),
          },
        },
      };
      break;
  }
  return state;
}

class ReduxStatelessTree extends PureComponent {
  getChildren(parent) {
    const nodes = this.props.treeNodes;
    return parent.children.map(childRow => nodes[childRow.id]);
  }

  render() {
    const props = this.props;

    // HeaderRow
    // HeaderRow

    return <div>TODO</div>;
    return (
      <TreeTable>
        <HeadersRow>
          <Header width={200}>Title</Header>
          <Header width={100}>Numbering</Header>
        </HeadersRow>
        <TreeRows
          rootsData={this.props.roots}
          render={({ id, title, numbering, childrenIds }) => (
            <TreeRow key={id} onChildrenDataRequested={props.onDataRequested}>
              <RowData>
                <DataCell>{title}</DataCell>
                <DataCell>{numbering}</DataCell>
              </RowData>
              <RowChildren
                childrenData={this.getChildren(childrenIds)}
                isLoading={this.isLoading(childrenIds)}
              />
            </TreeRow>
          )}
        />
      </TreeTable>
    );
    // return <TreeTable>
    //   <HeadersRow>
    //     <Header width={200}>Title</Header>
    //     <Header width={100}>Numbering</Header>
    //   </HeadersRow>
    //   <TreeRows
    //     rootsData={this.props.roots}
    //     render={({ id, title, numbering, children }) => (
    //       <RowData
    //         onChildrenDataRequested={props.onDataRequested}
    //         childrenData={children}
    //         key={id} hasChildren={children.length > 0}>
    //         <DataCell>{title}</DataCell>
    //         <DataCell>{numbering}</DataCell>
    //       </RowData>
    //     )}
    //   />
    // </TreeTable>;
  }
}

export default ReduxConnectedTree;

//
// <TreeTable>
//   <HeadersRow>
//     <Header width={200}>Title</Header>
//     <Header width={100}>Numbering</Header>
//   </HeadersRow>
//   <TreeRows
//     onDataRequested={this.props.onDataRequested} {/* Dispatches */}
//     getChildData={this.getChildren} {/* Returns child data */}
//     roots={this.props.roots}
//     render={({ id, title, numbering, children }) => (
//       <RowData
//         key={id} hasChildren={children.length > 0}>
//         <DataCell>{title}</DataCell>
//         <DataCell>{numbering}</DataCell>
//       </RowData>
//     )}
//   />
// </TreeTable>;
