// @flow
import React, {
  Component,
  type ElementType,
  type Node,
  PropTypes,
} from 'react';
import { TreeTableContainer } from '../styled';
import TreeRows from './TreeRows';
import RowData from './RowData';
import TreeHeads from './TreeHeads';
import TreeHead from './TreeHead';
import TreeCell from './TreeCell';

import { type DataFunction } from './../types';

type Props = {
  /** An array of React component constructors. Each component will be used to render a cell in a tree row.  */
  columns?: Array<ElementType>,

  /** The widths of the columns in the table. */
  columnWidths?: Array<string | number>,

  /** The headers of the table. */
  headers?: Array<string>,

  children?: Array<Node>,

  /** The function that will be used to provide data for rows at a particular level in the hierarchy */
  data?: DataFunction,
};

type State = {
  columnWidths: Array<string | number>,
};

export default class TreeTable extends Component<Props, State> {
  static childContextTypes = {
    treeTable: PropTypes.object.isRequired,
  };

  state = {
    columnWidths: [],
  };

  constructor() {
    super();
    this.setColumnWidth = this.setColumnWidth.bind(this);
    this.getColumnWidth = this.getColumnWidth.bind(this);
  }

  componentWillMount() {
    const widths = this.props.columnWidths;
    if (widths) {
      this.setState({ columnWidths: widths });
    }
  }

  setColumnWidth(columnIndex, width) {
    const columnWidths = this.state.columnWidths;
    if (width === columnWidths[columnIndex]) {
      return;
    }
    columnWidths[columnIndex] = width;
    this.setState({ columnWidths });
  }

  getColumnWidth(columnIndex) {
    return this.state && this.state.columnWidths[columnIndex];
  }

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
      <TreeHeads>
        {headers.map((header, index) => (
          <TreeHead key={index} index={index} width={columnWidths[index]}>
            {header}
          </TreeHead>
        ))}
      </TreeHeads>
    );
    let rows = null;
    if (columns && getRowChildrenData) {
      rows = (
        <TreeRows
          data={getRowChildrenData}
          render={data => (
            <RowData key={data.id} hasChildren={data.hasChildren}>
              {columns.map((Cell, index) => (
                <TreeCell key={index} index={index} width={columnWidths[index]}>
                  <Cell {...data.content} />
                </TreeCell>
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
