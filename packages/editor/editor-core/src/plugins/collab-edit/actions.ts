import { Step } from 'prosemirror-transform';
import { AllSelection, NodeSelection, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import {
  InitData,
  RemoteData,
  ConnectionData,
  PresenceData,
  TelepointerData,
  SendableSelection,
} from './types';

export const handleInit = (initData: InitData, view: EditorView) => {
  const { doc, json } = initData;
  if (doc) {
    const {
      state,
      state: { schema, tr },
    } = view;
    const content = (doc.content || []).map(child =>
      schema.nodeFromJSON(child),
    );

    if (content.length) {
      tr.setMeta('addToHistory', false);
      tr.replaceWith(0, state.doc.nodeSize - 2, content);
      tr.setSelection(Selection.atStart(tr.doc));
      tr.scrollIntoView();
      const newState = state.apply(tr);
      view.updateState(newState);
    }
  } else if (json) {
    applyRemoteSteps(json, view);
  }
};

export const handleConnection = (
  connectionData: ConnectionData,
  view: EditorView,
) => {
  const {
    state: { tr },
  } = view;
  view.dispatch(tr.setMeta('sessionId', connectionData));
};

export const handlePresence = (
  presenceData: PresenceData,
  view: EditorView,
) => {
  const {
    state: { tr },
  } = view;
  view.dispatch(tr.setMeta('presence', presenceData));
};

export const applyRemoteData = (remoteData: RemoteData, view: EditorView) => {
  const { json, newState } = remoteData;
  if (json) {
    applyRemoteSteps(json, view);
  } else if (newState) {
    view.updateState(newState);
  }
};

export const applyRemoteSteps = (json: any[], view: EditorView) => {
  const {
    state,
    state: { schema },
  } = view;
  let { tr } = state;

  json.forEach(stepJson => {
    const step = Step.fromJSON(schema, stepJson);
    tr.step(step);
  });

  tr.setMeta('addToHistory', false);
  tr.scrollIntoView();
  const newState = state.apply(tr);
  view.updateState(newState);
};

export const handleTelePointer = (
  telepointerData: TelepointerData,
  view: EditorView,
) => {
  const {
    state: { tr },
  } = view;
  view.dispatch(tr.setMeta('telepointer', telepointerData));
};

function isAllSelection(selection: Selection) {
  return selection instanceof AllSelection;
}

function isNodeSelection(selection: Selection) {
  return selection instanceof NodeSelection;
}

export const getSendableSelection = (
  selection: Selection,
): SendableSelection => {
  /**
   * <kbd>CMD + A</kbd> triggers a AllSelection
   * <kbd>escape</kbd> triggers a NodeSelection
   */
  return {
    type: 'textSelection',
    anchor: selection.anchor,
    head:
      isAllSelection(selection) || isNodeSelection(selection)
        ? selection.head - 1
        : selection.head,
  };
};
