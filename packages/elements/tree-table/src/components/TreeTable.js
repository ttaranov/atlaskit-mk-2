// @flow
import React, { Component, type ElementType, type Node } from 'react';
import PropTypes from 'prop-types';
import { TreeTableContainer } from '../styled';
import TreeRows from './TreeRows';
import RowData from './RowData';
import HeadersRow from './HeadersRow';
import Header from './Header';
import DataCell from './DataCell';

import { type DataFunction, type CSSWidth } from './../types';

type Props = {
  /** An array of React component constructors. Each component will be used to render a cell in a tree row.  */
  columns?: Array<ElementType>,

  /** The widths of the columns in the table. */
  columnWidths?: Array<CSSWidth>,

  /** The headers of the table. */
  headers?: Array<string>,

  children?: Array<Node>,

  /** The function that will be used to provide data for rows at a particular level in the hierarchy */
  data?: DataFunction,
};

type State = {
  columnWidths: Array<CSSWidth>,
};

export default class TreeTable extends Component<Props, State> {
  static childContextTypes = {
    treeTable: PropTypes.object.isRequired,
  };

  state = {
    columnWidths: [],
  };

  componentWillMount() {
    const widths = this.props.columnWidths;
    if (widths) {
      this.setState({ columnWidths: widths });
    }
  }

  setColumnWidth = (columnIndex: number, width: CSSWidth) => {
    const columnWidths = this.state.columnWidths;
    if (width === columnWidths[columnIndex]) {
      return;
    }
    columnWidths[columnIndex] = width;
    this.setState({ columnWidths });
  };

  getColumnWidth = (columnIndex: number): CSSWidth | null => {
    return (this.state && this.state.columnWidths[columnIndex]) || null;
  };

  getChildContext() {
    return {
      treeTable: {
        columnWidths: this.state.columnWidths,
        setColumnWidth: this.setColumnWidth,
        getColumnWidth: this.getColumnWidth,
      },
    };
  }

  render() {
    const {
      data: getRowChildrenData,
      headers,
      columns,
      columnWidths = [],
    } = this.props;
    const heads = headers && (
      <HeadersRow>
        {headers.map((header, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Header key={index} columnIndex={index} width={columnWidths[index]}>
            {header}
          </Header>
        ))}
      </HeadersRow>
    );
    let rows = null;
    if (columns && getRowChildrenData) {
      rows = (
        <TreeRows
          data={getRowChildrenData}
          render={data => (
            <RowData key={data.id} hasChildren={data.hasChildren}>
              {columns.map((Cell, index) => (
                <DataCell
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  columnIndex={index}
                  width={columnWidths[index]}
                >
                  <Cell {...data.content} />
                </DataCell>
              ))}
            </RowData>
          )}
        />
      );
    }
    return (
      <TreeTableContainer>
        {heads}
        {rows}
        {this.props.children}
      </TreeTableContainer>
    );
  }
}
