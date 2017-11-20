import {
  akColorR400,
  akColorY400,
  akColorG400,
  akColorB400,
  akColorT400,
  akColorP400,
  akColorN800,
} from '@atlaskit/util-shared-styles';

import { Decoration, DecorationSet } from 'prosemirror-view';

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
): Decoration[] | undefined => {
  const current = decorations.find();
  let ret: Decoration[] = [];
  for (let i = 0; i < current.length; i++) {
    if ((current[i] as any).spec.pointer.sessionId === id) {
      ret.push(current[i]);
    }
  }
  return ret;
};
