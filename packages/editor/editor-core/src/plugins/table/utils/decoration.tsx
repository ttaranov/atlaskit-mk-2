import { Node as PmNode } from 'prosemirror-model';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const createHoverDecoration = (
  cells: { pos: number; node: PmNode }[],
  danger?: boolean,
): Decoration[] => {
  const deco = cells.map(cell => {
    const classes = ['hoveredCell'];
    if (danger) {
      classes.push('danger');
    }

    return Decoration.node(cell.pos, cell.pos + cell.node.nodeSize, {
      class: classes.join(' '),
    });
  });

  return deco;
};

export const findHoverDecoration = (
  decorationSet: DecorationSet,
): Decoration[] =>
  decorationSet
    .find()
    .reduce(
      (arr, deco: any) =>
        (deco.type.attrs.class || '').indexOf('hoveredCell') > -1
          ? arr.concat(deco)
          : arr,
      [],
    );
