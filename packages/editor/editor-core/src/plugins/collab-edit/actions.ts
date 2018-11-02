import { receiveTransaction } from 'prosemirror-collab';
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
  CollabEditOptions,
} from './types';

import { replaceDocument } from './utils';

export const handleInit = (
  initData: InitData,
  view: EditorView,
  options?: CollabEditOptions,
) => {
  const { doc, json, version } = initData;
  if (doc) {
    const { state } = view;
    const tr = replaceDocument(doc, state, version, options);
    tr.setMeta('isRemote', true);
    const newState = state.apply(tr);
    view.updateState(newState);
  } else if (json) {
    applyRemoteSteps(json, undefined, view);
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

export const applyRemoteData = (
  remoteData: RemoteData,
  view: EditorView,
  options?: CollabEditOptions,
) => {
  const { json, newState, userIds = [] } = remoteData;
  if (json) {
    applyRemoteSteps(json, userIds, view, options);
  } else if (newState) {
    view.updateState(newState);
  }
};

export const applyRemoteSteps = (
  json: any[],
  userIds: string[] | undefined,
  view: EditorView,
  options?: CollabEditOptions,
) => {
  const {
    state,
    state: { schema },
  } = view;

  const steps = json.map(step => Step.fromJSON(schema, step));

  let tr;

  if (options && options.useNativePlugin) {
    tr = receiveTransaction(state, steps, userIds);
  } else {
    tr = state.tr;
    steps.forEach(step => tr.step(step));
  }

  if (tr) {
    tr.setMeta('addToHistory', false);
    tr.setMeta('isRemote', true);
    tr.scrollIntoView();
    const newState = state.apply(tr);
    view.updateState(newState);
  }
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
