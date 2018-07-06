import { setParentNodeMarkup, removeParentNodeOfType } from 'prosemirror-utils';
import { analyticsService } from '../../analytics';
import { Command } from '../../types';

export type DomAtPos = (pos: number) => { node: HTMLElement; offset: number };

export const removePanel = (): Command => (state, dispatch) => {
  const {
    schema: { nodes },
    tr,
  } = state;
  dispatch(removeParentNodeOfType(nodes.panel)(tr));
  return true;
};

export const changePanelType = (panelType): Command => (state, dispatch) => {
  analyticsService.trackEvent(
    `atlassian.editor.format.${panelType.panelType}.button`,
  );
  const {
    schema: { nodes },
    tr,
  } = state;
  dispatch(setParentNodeMarkup(nodes.panel, null, panelType)(tr));
  return true;
};
