import { Node as PmNode } from 'prosemirror-model';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { TableDecorations } from '../types';
import { TableCssClassName as ClassName } from '../types';

export const createHoverDecoration = (
  cells: { pos: number; node: PmNode }[],
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
      { id: TableDecorations.CONTROLS_HOVER },
    );
  });

  return deco;
};

export const findHoverDecoration = (
  decorationSet: DecorationSet,
): Decoration[] =>
  decorationSet
    .find()
    .reduce(
      (decorationArr: Decoration[], deco: Decoration) =>
        deco.spec.id === TableDecorations.CONTROLS_HOVER
          ? decorationArr.concat(deco)
          : decorationArr,
      [],
    );
