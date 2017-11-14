import {
  akColorR400,
  akColorY400,
  akColorG400,
  akColorB400,
  akColorT400,
  akColorP400,
  akColorN800,
} from '@atlaskit/util-shared-styles';

import {
  Decoration,
  DecorationSet,
} from 'prosemirror-view';

export interface Color {
  solid: string;
  selection: string;
}

export const colors: Color[] = [
  {
    solid: akColorR400,
    selection: 'rgba(222, 53, 11, .5)'
  },
  {
    solid: akColorY400,
    selection: 'rgba(255, 153, 31, .5)'
  },
  {
    solid: akColorG400,
    selection: 'rgba(0, 135, 90, .5)'
  },
  {
    solid: akColorT400,
    selection: 'rgba(0, 163, 191, .5)'
  },
  {
    solid: akColorB400,
    selection: 'rgba(0, 82, 204, .5)'
  },
  {
    solid: akColorP400,
    selection: 'rgba(82, 67, 170, .5)'
  },
  {
    solid: akColorN800,
    selection: 'rgba(23, 43, 7, .5)'
  },
];

// tslint:disable:no-bitwise
export const getAvatarColor = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }

  const index = (Math.abs(hash) % colors.length);

  return { index, color: colors[index] };
};
// tslint:enable:no-bitwise

export const findPointer = (id: string, decorations: DecorationSet): Decoration | undefined => {
  let current = decorations.find();
  for (let i = 0; i < current.length; i++) {
    if ((current[i] as any).spec.pointer.sessionId === id) {
      return current[i];
    }
  }
};
