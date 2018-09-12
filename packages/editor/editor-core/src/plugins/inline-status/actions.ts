import {
  setParentNodeMarkup,
  removeParentNodeOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { PanelType } from '@atlaskit/editor-common';
import { analyticsService } from '../../analytics';
import { Command } from '../../types';
import {
  EditorState,
  Transaction,
  NodeSelection,
  Selection,
} from 'prosemirror-state';

import { pluginKey } from './pm-plugins/main';

export type DomAtPos = (pos: number) => { node: HTMLElement; offset: number };

export const removePanel = (): Command => (state, dispatch) => {
  const {
    schema: { nodes },
    tr,
  } = state;
  analyticsService.trackEvent(`atlassian.editor.format.panel.delete.button`);
  dispatch(removeParentNodeOfType(nodes.inlineStatus)(tr));
  return true;
};

export const changePanelType = (panelType: PanelType): Command => (
  state,
  dispatch,
) => {
  const {
    schema: { nodes },
    tr,
  } = state;
  analyticsService.trackEvent(
    `atlassian.editor.format.panel.${panelType}.button`,
  );
  dispatch(setParentNodeMarkup(nodes.inlineStatus, null, { panelType })(tr));
  return true;
};

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
  console.log('#changeColor - color: ', color);
  const appearance = colorToLozengeAppearanceMap[color || 'neutral'];
  const findparent = findParentNodeOfType(nodes.inlineStatus)(
    state.tr.selection,
  );
  console.log('parent is ', findparent);
  dispatch(
    setParentNodeMarkup(nodes.inlineStatus, null, { appearance, color })(tr),
  );
  return true;
};

export const setDatePickerAt = (showDatePickerAt: number | null) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(state.tr.setMeta(pluginKey, { showDatePickerAt }));
  return true;
};

export const closeDatePicker = () => (state, dispatch) => {
  const { showDatePickerAt } = pluginKey.getState(state);

  if (!showDatePickerAt) {
    return false;
  }

  dispatch(
    state.tr
      .setMeta(pluginKey, { showDatePickerAt: null })
      .setSelection(Selection.near(state.tr.doc.resolve(showDatePickerAt + 2))),
  );
};
