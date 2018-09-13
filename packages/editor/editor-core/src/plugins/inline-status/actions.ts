import { setParentNodeMarkup } from 'prosemirror-utils';
import { Command } from '../../types';
import { EditorState, Transaction } from 'prosemirror-state';

import { pluginKey } from './pm-plugins/main';

export type DomAtPos = (pos: number) => { node: HTMLElement; offset: number };

const colorToLozengeAppearanceMap = {
  neutral: 'default',
  purple: 'new',
  blue: 'inprogress',
  red: 'removed',
  yellow: 'moved',
  green: 'success',
};

export const changeColor = (color: string): Command => (state, dispatch) => {
  const {
    schema: { nodes },
    tr,
  } = state;
  const appearance = colorToLozengeAppearanceMap[color || 'neutral'];
  dispatch(
    setParentNodeMarkup(nodes.inlineStatus, null, { appearance, color })(tr),
  );
  return true;
};

export const setPickerAt = (showPickerAt: number | null) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(state.tr.setMeta(pluginKey, { showPickerAt }));
  return true;
};
