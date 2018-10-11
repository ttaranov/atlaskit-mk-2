import { EditorState, Selection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { colors as themeColors } from '@atlaskit/theme';

import { hexToRgba } from '@atlaskit/editor-common';

import { CollabEditOptions } from './types';

export interface Color {
  solid: string;
  selection: string;
}

const { R400, Y400, G400, B400, T400, P400, N800 } = themeColors;

export const colors: Color[] = [R400, Y400, G400, T400, B400, P400, N800].map(
  solid => ({
    solid,
    selection: hexToRgba(solid, 0.2)!,
  }),
);

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
  return `border-left: 1px solid ${color}; border-right: 1px solid ${color}; margin-right: -2px;`;
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

export const replaceDocument = (
  doc: any,
  state: EditorState,
  version?: number,
  options?: CollabEditOptions,
) => {
  const { schema, tr } = state;

  const content = (doc.content || []).map(child => schema.nodeFromJSON(child));

  if (content.length) {
    tr.setMeta('addToHistory', false);
    tr.replaceWith(0, state.doc.nodeSize - 2, content);
    tr.setSelection(Selection.atStart(tr.doc));
    tr.scrollIntoView();

    if (typeof version !== undefined && (options && options.useNativePlugin)) {
      const collabState = { version, unconfirmed: [] };
      tr.setMeta('collab$', collabState);
    }
  }

  return tr;
};
