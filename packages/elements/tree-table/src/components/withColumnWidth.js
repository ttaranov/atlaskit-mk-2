// @flow
import React, { PureComponent, type Node, type ComponentType } from 'react';
import PropTypes from 'prop-types';
import { type CSSWidth } from '../types';

type Props = {
  children: Node,
  width?: CSSWidth,
  columnIndex: number,
};

export default function withColumnWidth(
  Cell: ComponentType<*>,
): ComponentType<*> {
  return class CellWithColumnWidth extends PureComponent<*> {
    static contextTypes = {
      treeTable: PropTypes.object.isRequired,
    };

    componentWillMount() {
      this.setColumnWidth(this.props.width);
    }

    setColumnWidth(width: ?CSSWidth) {
      if (width !== undefined) {
        this.context.treeTable.setColumnWidth(this.props.columnIndex, width);
      }
    }

    componentWillReceiveProps(nextProps: Props) {
      this.setColumnWidth(nextProps.width);
    }

    render() {
      const { width, columnIndex } = this.props;
      const columnWidth =
        width !== null && width !== undefined
          ? width
          : this.context.treeTable.getColumnWidth(columnIndex);
      return <Cell {...this.props} width={columnWidth} />;
    }
  };
}
