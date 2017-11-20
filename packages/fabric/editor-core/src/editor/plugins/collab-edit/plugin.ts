import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import ProviderFactory from '../../../providerFactory';
import { isChromeWithSelectionBug } from '../../../utils';
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
import { getAvatarColor, findPointers } from './utils';
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

  get(sessionId: string) {
    return this.participants.get(sessionId);
  }
}

function style(options) {
  const color = (options && options.color) || 'black';
  return `border-left: 1px solid ${color}; border-right: 1px solid ${color}; margin-right: -2px;`;
}

const createTelepointers = (from: number, to: number, sessionId: string, isSelection: boolean, initial: string) => {
  let decorations: Decoration[] = [];
  const avatarColor = getAvatarColor(sessionId);
  const color = avatarColor.index.toString();
  if (isSelection) {
    const className = `telepointer color-${color} telepointer-selection`;
    decorations.push((Decoration as any).inline(from, to, { class: className, 'data-initial': initial }, { pointer: { sessionId } }));
  }

  const cursor = document.createElement('span');
  cursor.textContent = '\u200b';
  cursor.className = `telepointer color-${color} telepointer-selection-badge`;
  cursor.style.cssText = `${style({ color: avatarColor.color.solid })};`;
  cursor.setAttribute('data-initial', initial);
  return decorations.concat((Decoration as any).widget(to, cursor, { pointer: { sessionId } }));
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

    let add: Decoration[] = [];
    let remove: Decoration[] = [];

    if (presenceData) {
      const { joined = [] as Participant[], left = [] as { sessionId: string }[] } = presenceData;

      participants = participants.remove(left.map(i => i.sessionId));
      participants = participants.add(joined);

      // Remove telepointers for users that left
      left.forEach(i => {
        const pointers = findPointers(i.sessionId, decorationSet);
        if (pointers) {
          remove = remove.concat(pointers);
        }
      });
    }

    if (telepointerData) {
      const { sessionId } = telepointerData;
      if (sessionId && sessionId !== sid) {
        const oldPointers = findPointers(telepointerData.sessionId, decorationSet);
        if (oldPointers) {
          remove = remove.concat(oldPointers);
        }

        const { anchor, head } = telepointerData.selection;
        const from = anchor < head ? anchor : head;
        const to = anchor >= head ? anchor : head;

        const isSelection = to - from > 0;
        // This problem affects Chrome v58-62. See: https://github.com/ProseMirror/prosemirror/issues/710
        if (!isSelection && isChromeWithSelectionBug) {
          document.getSelection().empty();
        }

        const participant = participants.get(sessionId);
        const initial = (participant ? participant.name.substring(0, 1).toUpperCase() : 'X');
        add = add.concat(createTelepointers(from - (isSelection ? 0 : 1), to, sessionId, isSelection, initial));
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
