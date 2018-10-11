import { Decoration, DecorationSet } from 'prosemirror-view';
import {
  TableCssClassName as ClassName,
  TableDecorations,
  Cell,
} from '../types';

export const createControlsHoverDecoration = (
  cells: Cell[],
  danger?: boolean,
): Decoration[] => {
  const deco = cells.map(cell => {
    const classes = [ClassName.HOVERED_CELL];
    if (danger) {
      classes.push('danger');
    }

    return Decoration.node(
      cell.pos,
      cell.pos + cell.node.nodeSize,
      {
        class: classes.join(' '),
      },
      { key: TableDecorations.CONTROLS_HOVER },
    );
  });

  return deco;
};

export const findControlsHoverDecoration = (
  decorationSet: DecorationSet,
): Decoration[] =>
  decorationSet.find(
    undefined,
    undefined,
    spec => spec.key === TableDecorations.CONTROLS_HOVER,
  );

export const findInsertLineDecoration = (
  decorationSet: DecorationSet,
): Decoration[] =>
  decorationSet.find(undefined, undefined, spec => {
    return (
      spec.key === TableDecorations.COLUMN_INSERT_LINE ||
      spec.key === TableDecorations.ROW_INSERT_LINE
    );
  });

export const createColumnInsertLineDecoration = (
  cells: Cell[],
  columnIndex: number,
): Decoration[] =>
  cells.map(cell => {
    const domNode = document.createElement('div');
    domNode.className = `${ClassName.COLUMN_INSERT_LINE} ${
      columnIndex === 0 ? 'left' : 'right'
    }`;
    return Decoration.widget(cell.pos + cell.node.nodeSize - 1, domNode, {
      key: TableDecorations.COLUMN_INSERT_LINE,
    });
  });

export const createRowInsertLineDecoration = (
  cells: Cell[],
  rowIndex: number,
): Decoration[] =>
  cells.map(cell => {
    const domNode = document.createElement('div');
    domNode.className = `${ClassName.ROW_INSERT_LINE} ${
      rowIndex === 0 ? 'top' : 'bottom'
    }`;
    return Decoration.widget(cell.pos + cell.node.nodeSize - 1, domNode, {
      key: TableDecorations.ROW_INSERT_LINE,
    });
  });
