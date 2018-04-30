// @flow
import React, { Component, type ElementType, type Node } from 'react';
import PropTypes from 'prop-types';
import { TableTreeContainer } from '../styled';
import Rows from './Rows';
import Row from './Row';
import Headers from './Headers';
import Header from './Header';
import Cell from './Cell';

import {
  type ItemsProvider,
  type ItemsDataType,
  type CSSWidth,
} from './../types';

const noop = () => {};

type Props = {
  /** An array of React component constructors. Each component will be used to render a cell in a tree row.  */
  columns?: Array<ElementType>,

  /** The widths of the respective columns in the table. */
  columnWidths?: Array<CSSWidth>,

  /** The headers of the respective columns of the table. */
  headers?: Array<string>,

  children?: Node,

  /** The function that will be used to provide data for rows at a particular level in the hierarchy */
  items?: ItemsDataType,

  getRowData?: ItemsProvider,
};

type State = {
  columnWidths: Array<CSSWidth>,
};

export default class TableTree extends Component<Props, State> {
  static childContextTypes = {
    tableTree: PropTypes.object.isRequired,
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
      tableTree: {
        columnWidths: this.state.columnWidths,
        setColumnWidth: this.setColumnWidth,
        getColumnWidth: this.getColumnWidth,
      },
    };
  }

  render() {
    const {
      items,
      getRowData,
      headers,
      columns,
      columnWidths = [],
    } = this.props;
    const heads = headers && (
      <Headers>
        {headers.map((header, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Header key={index} columnIndex={index} width={columnWidths[index]}>
            {header}
          </Header>
        ))}
      </Headers>
    );
    let rows = null;
    if (columns && items) {
      rows = (
        <Rows
          items={items}
          getRowData={getRowData || noop}
          render={data => (
            <Row itemId={data.id} hasChildren={data.hasChildren}>
              {columns.map((CellContent, index) => (
                <Cell
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  columnIndex={index}
                  width={columnWidths[index]}
                >
                  <CellContent {...data.content} />
                </Cell>
              ))}
            </Row>
          )}
        />
      );
    }
    return (
      <TableTreeContainer role={'treegrid'} aria-readonly>
        {heads}
        {rows}
        {this.props.children}
      </TableTreeContainer>
    );
  }
}
