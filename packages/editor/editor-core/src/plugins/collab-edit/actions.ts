// tslint:disable:no-console
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
} from './types';

export const handleInit = (initData: InitData, view: EditorView) => {
  const { doc, json, version } = initData;
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
      let newState = state.apply(tr);

      if (typeof version !== undefined) {
        const collabState = { version, unconfirmed: [] };
        const { tr } = newState;

        newState = newState.apply(tr.setMeta('collab$', collabState));
      }

      view.updateState(newState);
    }
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

export const applyRemoteData = (remoteData: RemoteData, view: EditorView) => {
  const { json, newState, clientIDs = [] } = remoteData;
  if (json) {
    applyRemoteSteps(json, clientIDs, view);
  } else if (newState) {
    view.updateState(newState);
  }
};

export const applyRemoteSteps = (
  json: any[],
  clientIDs: string[] | undefined,
  view: EditorView,
) => {
  const {
    state,
    state: { schema },
  } = view;

  const steps = json.map(step => Step.fromJSON(schema, step));

  console.log('appyling steps', json);

  let tr;

  if (clientIDs) {
    // try {
    tr = receiveTransaction(state, steps, clientIDs);
    // } catch (err) {
    //   throw new Error()
    //   console.log(, err);
    // }
  } else {
    tr = state.tr;
    steps.forEach(step => tr.step(step));
  }

  if (tr) {
    tr.setMeta('addToHistory', false);
    tr.scrollIntoView();
    const newState = state.apply(tr);
    view.updateState(newState);
  } else {
    console.log('could not apply steps!', json);
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
