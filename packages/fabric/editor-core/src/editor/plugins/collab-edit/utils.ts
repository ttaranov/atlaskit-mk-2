import { Decoration, DecorationSet } from 'prosemirror-view';
import {
  akColorR400,
  akColorY400,
  akColorG400,
  akColorB400,
  akColorT400,
  akColorP400,
  akColorN800,
} from '@atlaskit/util-shared-styles';

import { hexToRgba } from '../../../utils/color';

export interface Color {
  solid: string;
  selection: string;
}

export const colors: Color[] = [
  akColorR400,
  akColorY400,
  akColorG400,
  akColorT400,
  akColorB400,
  akColorP400,
  akColorN800,
].map(solid => ({
  solid,
  selection: hexToRgba(solid, 0.2)!,
}));

// tslint:disable:no-bitwise
export const getAvatarColor = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }

  const index = Math.abs(hash) % colors.length;

  return { index, color: colors[index] };
};
// tslint:enable:no-bitwise

export const findPointers = (
  id: string,
  decorations: DecorationSet,
): Decoration[] =>
  decorations
    .find()
    .reduce(
      (arr, deco: any) =>
        deco.spec.pointer.sessionId === id ? arr.concat(deco) : arr,
      [],
    );

function style(options) {
  const color = (options && options.color) || 'black';
  return `border-left: 1px solid ${color}; border-right: 1px solid ${
    color
  }; margin-right: -2px;`;
}

export const createTelepointers = (
  from: number,
  to: number,
  sessionId: string,
  isSelection: boolean,
  initial: string,
) => {
  let decorations: Decoration[] = [];
  const avatarColor = getAvatarColor(sessionId);
  const color = avatarColor.index.toString();
  if (isSelection) {
    const className = `telepointer color-${color} telepointer-selection`;
    decorations.push(
      (Decoration as any).inline(
        from,
        to,
        { class: className, 'data-initial': initial },
        { pointer: { sessionId } },
      ),
    );
  }

  const cursor = document.createElement('span');
  cursor.textContent = '\u200b';
  cursor.className = `telepointer color-${color} telepointer-selection-badge`;
  cursor.style.cssText = `${style({ color: avatarColor.color.solid })};`;
  cursor.setAttribute('data-initial', initial);
  return decorations.concat(
    (Decoration as any).widget(to, cursor, { pointer: { sessionId } }),
  );
};
