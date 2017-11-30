// @flow
import React, {
  Component,
  type ElementType,
  type Node,
  PropTypes,
} from 'react';
import { TreeTableContainer, TreeCell } from '../styled';
import TreeRows from './TreeRows';
import RowData from './RowData';
import TreeHeads from './TreeHeads';
import TreeHead from './TreeHead';

import { type DataFunction } from './../types';

type Props = {
  /** This is the columns prop description */
  columns?: Array<ElementType>,
  columnWidths?: Array<string>,
  children?: Array<Node>,
  headers?: Array<string>,
  // headers?: Array<string>,
  /** This is the data prop description */
  data?: DataFunction | string,
};

type State = {
  columnWidths: Array<string>,
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
  }

  componentWillMount() {
    const widths = this.props.columnWidths;
    if (widths) {
      this.setState({ columnWidths: widths });
    }
  }

  setColumnWidth(index, width) {
    const columnWidths = this.state.columnWidths;
    if (width === columnWidths[index]) {
      return;
    }
    columnWidths[index] = width;
    this.setState({ columnWidths });
  }

  getChildContext() {
    return {
      treeTable: {
        columnWidths: this.state.columnWidths,
        setColumnWidth: this.setColumnWidth,
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
