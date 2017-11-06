import { Step } from 'prosemirror-transform';
import { EditorState } from 'prosemirror-state';
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
    const { state, state: { schema, tr } } = view;
    const content = (doc.content || []).map(child => schema.nodeFromJSON(child));

    if (content.length) {
      const newState = state.apply(
        tr
          .setMeta('addToHistory', false)
          .replaceWith(0, state.doc.nodeSize - 2, content)
          .scrollIntoView()
      );
      view.updateState(newState);
    }
  } else if (json) {
    applyRemoteSteps(json, view);
  }
};

export const handleConnection = (connectionData: ConnectionData, view: EditorView) => {
  const { state: { tr } } = view;
  view.dispatch(tr.setMeta('sessionId', connectionData));
};

export const handlePresence = (presenceData: PresenceData, view: EditorView) => {
  const { state: { tr } } = view;
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
  const { state, state: { schema } } = view;
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

export const handleTelePointer = (telepointerData: TelepointerData, view: EditorView) => {
  const { state: { tr } } = view;
  view.dispatch(
    tr
      .setMeta('telepointer', telepointerData)
      .scrollIntoView()
  );
};

export const getSendableSelection = (oldState: EditorState, newState: EditorState): SendableSelection | undefined => {
  const oldSelection = oldState.selection;
  const newSelection = newState.selection;

  if (oldSelection.anchor !== newSelection.anchor ||oldSelection.head !== newSelection.head) {
    return {
      type: 'textSelection',
      anchor: newSelection.anchor,
      head: newSelection.head
    };
  }
};
