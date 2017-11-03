import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import ProviderFactory from '../../../providerFactory';
import { Dispatch } from '../../event-dispatcher';
import {
  getSendableSelection,
  handleInit,
  handleConnection,
  handlePresence,
  handleTelePointer,
  applyRemoteData,
} from './actions';
import {
  Participant,
  ConnectionData,
  PresenceData,
  TelepointerData
} from './types';
import { getAvatarColor, findPointer } from './utils';
import { CollabEditProvider } from './provider';
export {
  CollabEditProvider,
};

export const pluginKey = new PluginKey('collabEditPlugin');

export const createPlugin = (dispatch: Dispatch, providerFactory: ProviderFactory) => {

  let collabEditProvider: CollabEditProvider | null;
  let isReady = false;

  return new Plugin({
    key: pluginKey,
    state: {
      init: PluginState.init,
      apply(tr, prevPluginState: PluginState, oldState, newState) {
        const pluginState = prevPluginState.apply(tr);

        if (tr.getMeta('isLocal')) {
          if (collabEditProvider) {
            collabEditProvider.send(tr, oldState, newState);
          }
        }

        const { activeParticipants, sessionId } = pluginState;

        if (collabEditProvider) {
          const selection = getSendableSelection(oldState, newState);
          if (selection && sessionId) {
            collabEditProvider.sendMessage({
              type: 'telepointer',
              selection,
              sessionId,
            });
          }
        }

        dispatch(pluginKey, { activeParticipants, sessionId });

        return pluginState;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state).decorations;
      }
    },
    filterTransaction(tr, state) {
      // Don't allow transactions that modifies the document before
      // collab-plugin is ready.
      if (!isReady && tr.docChanged) {
        return false;
      }

      return true;
    },
    view(view) {
      providerFactory.subscribe('collabEditProvider', async (name: string, providerPromise?: Promise<CollabEditProvider>) => {
        if (providerPromise) {
          collabEditProvider = await providerPromise;

          // Initialize provider
          collabEditProvider
            .on('init', data => { isReady = true; handleInit(data, view); })
            .on('connected', data => handleConnection(data, view))
            .on('data', data => applyRemoteData(data, view))
            .on('presence', data => handlePresence(data, view))
            .on('telepointer', data => handleTelePointer(data, view))
            .on('error', err => {
              // TODO: Handle errors propery (ED-2580)
            })
            .initialize(() => view.state)
            ;
        } else {
          collabEditProvider = null;
          isReady = false;
        }
      });

      return {
        destroy() {
          providerFactory.unsubscribeAll('collabEditProvider');
          collabEditProvider = null;
        }
      };

    }
  });
};

export class Participants {

  private participants: Map<string, Participant>;

  constructor(participants: Map<string, Participant> = new Map<string, Participant>()) {
    this.participants = participants;
  }

  add(data: Participant[]) {
    const newSet = new Map<string, Participant>(this.participants);
    data.forEach(participant => {
      newSet.set(participant.sessionId, participant);
    });
    return new Participants(newSet);
  }

  remove(sessionIds: string[]) {
    const newSet = new Map<string, Participant>(this.participants);
    sessionIds.forEach(sessionId => {
      newSet.delete(sessionId);
    });

    return new Participants(newSet);
  }

  update(sessionId: string, lastActive: number) {
    const newSet = new Map<string, Participant>(this.participants);
    const data = newSet.get(sessionId);
    if (!data) {
      return this;
    }

    newSet.set(sessionId, {
      ...data,
      lastActive
    });

    return new Participants(newSet);
  }

  toArray() {
    return Array.from(this.participants.values());
  }

}

const createTelepointer = (from: number, to: number, sessionId: string, isSelection: boolean) => {
  // TODO: Use Decoration.widget when there's no selection. (ED-2728)
  const color = getAvatarColor(sessionId).index.toString();
  return (Decoration as any).inline(from, to, { class: `telepointer color-${color} ${isSelection ? 'telepointer-selection' : 'telepointer-pointer'}` }, { pointer: { sessionId } });
};

export class PluginState {

  private decorationSet: DecorationSet;
  private participants: Participants;
  private sid?: string;

  get decorations() {
    return this.decorationSet;
  }

  get activeParticipants() {
    return this.participants.toArray();
  }

  get sessionId() {
    return this.sid;
  }

  constructor(decorations: DecorationSet, participants: Participants, sessionId?: string) {
    this.decorationSet = decorations;
    this.participants = participants;
    this.sid = sessionId;
  }

  apply(tr: Transaction) {
    let { decorationSet, participants, sid } = this;

    const presenceData = tr.getMeta('presence') as PresenceData;
    const telepointerData = tr.getMeta('telepointer') as TelepointerData;
    const sessionIdData = tr.getMeta('sessionId') as ConnectionData;

    if (sessionIdData) {
      sid = sessionIdData.sid;
    }

    const add: Decoration[] = [];
    const remove: Decoration[] = [];

    if (presenceData) {
      const { joined = [] as Participant[], left = [] as { sessionId: string }[] } = presenceData;

      participants = participants.remove(left.map(i => i.sessionId));
      participants = participants.add(joined);

      // Remove telepointers for users that left
      left.forEach(i => {
        const pointer = findPointer(i.sessionId, decorationSet);
        if (pointer) {
          remove.push(pointer);
        }
      });
    }

    if (telepointerData) {
      const { sessionId } = telepointerData;
      if (sessionId && sessionId !== sid) {
        const oldPointer = findPointer(telepointerData.sessionId, decorationSet);
        if (oldPointer) {
          remove.push(oldPointer);
        }

        const { anchor, head } = telepointerData.selection;
        const from = anchor < head ? anchor : head;
        const to = anchor >= head ? anchor : head;

        const isSelection = to - from > 0;
        add.push(createTelepointer(from - (isSelection ? 0 : 1), to, sessionId, isSelection));
      }
    }

    if (remove.length) {
      decorationSet = decorationSet.remove(remove);
    }

    if (add.length) {
      decorationSet = decorationSet.add(tr.doc, add);
    }

    return new PluginState(decorationSet, participants, sid);
  }

  static init(config: any) {
    const { doc } = config;

    return new PluginState(DecorationSet.create(doc, []), new Participants());
  }
}
