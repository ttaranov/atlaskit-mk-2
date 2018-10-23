// @flow
import React, {
  Component,
  type Node,
  type ComponentType,
  type ElementType,
} from 'react';
import PropTypes from 'prop-types';
import { type CSSWidth } from '../types';

type Props = {
  children: Node, // eslint-disable-line react/no-unused-prop-types
  width?: CSSWidth,
  columnIndex: number,
};

export default function withColumnWidth(Cell: ElementType): ComponentType<*> {
  return class CellWithColumnWidth extends Component<Props> {
    static contextTypes = {
      tableTree: PropTypes.object.isRequired,
    };

    componentWillMount() {
      this.setColumnWidth(this.props.width);
    }

    setColumnWidth(width: ?CSSWidth) {
      if (width !== undefined) {
        this.context.tableTree.setColumnWidth(this.props.columnIndex, width);
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
          : this.context.tableTree.getColumnWidth(columnIndex);
      return <Cell {...this.props} width={columnWidth} />;
    }
  };
}
