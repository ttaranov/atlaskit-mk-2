// @flow
import React, { PureComponent, PropTypes } from 'react';

export default function withColumnWidth(Cell) {
  type Props = {
    children: Array<Node>,
    width?: number,
    columnIndex: number,
  };

  return class CellWithColumnWidth extends PureComponent<Props> {
    static contextTypes = {
      treeTable: PropTypes.object.isRequired,
    };

    componentWillMount() {
      this.setColumnWidth(this.props.width);
    }

    setColumnWidth(width) {
      if (width !== undefined) {
        this.context.treeTable.setColumnWidth(this.props.index, width);
      }
    }

    componentWillReceiveProps(nextProps) {
      this.setColumnWidth(nextProps.width);
    }

    render() {
      const { width, columnIndex } = this.props;
      const columnWidth =
        width !== null && width !== undefined
          ? width
          : this.context.treeTable.getColumnWidth(columnIndex);
      return <Cell {...this.props} columnWidth={columnWidth} />;
    }
  };
}
