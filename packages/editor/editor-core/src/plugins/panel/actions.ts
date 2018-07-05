import { EditorView } from 'prosemirror-view';
import { setParentNodeMarkup, removeParentNodeOfType } from 'prosemirror-utils';
import { analyticsService } from '../../analytics';

export type DomAtPos = (pos: number) => { node: HTMLElement; offset: number };

export const removePanel = (view: EditorView) => {
  const {
    state: { tr, schema },
    dispatch,
  } = view;
  dispatch(removeParentNodeOfType(schema.nodes.panel)(tr));
};

export const changePanelType = (view: EditorView, { panelType }) => {
  analyticsService.trackEvent(`atlassian.editor.format.${panelType}.button`);
  const {
    state: { tr, schema },
    dispatch,
  } = view;
  dispatch(setParentNodeMarkup(schema.nodes.panel, null, { panelType })(tr));
};
