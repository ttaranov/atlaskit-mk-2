// tslint:disable:no-console
import { EventEmitter } from 'events';
import { Step } from 'prosemirror-transform';
import { getVersion, sendableSteps } from 'prosemirror-collab';
import * as io from 'socket.io-client';
import {
  CollabEditProvider,
  CollabEvent,
} from '../src/plugins/collab-edit/provider';
import { getSendableSelection } from '../src/plugins/collab-edit/actions';

const participants = [
  'Awilda Mcentire',
  'Katie Iddings',
  'Serafina Mcdowell',
  'Eun Knopp',
  'Walker Reighard',
  'Keely Muth',
  'Allie April',
  'Rosamond Paton',
  'Lashawnda Peppard',
  'Hubert Feingold',
  'Idalia Mcquaig',
  'Wyatt Byer',
  'Genevieve Reeder',
  'Dona Elton',
  'Jerilyn Holte',
  'Salina Erhardt',
  'Velda Latour',
  'Regina Richer',
  'Natisha Tiger',
  'Glynda Stuckey',
  'Wilson Woodberry',
  'Elvie Furtado',
  'Lasandra Palmatier',
  'Louise Mijares',
  'Herma Vanleer',
  'Titus Plante',
  'James Fiscus',
  'Ina Ramero',
  'Jeanene Bernabe',
  'Lida Lepine',
  'Rosalina Palka',
  'Dayle Grossi',
  'Zack Leister',
  'Isobel Fay',
  'Elouise Kluge',
  'Twyla Machin',
  'Diane Herrington',
  'Fumiko Elders',
  'Kennith Howe',
  'Doloris Mccollom',
  'Daryl Wherry',
  'Sade Albury',
  'Roy Cork',
  'Hunter Hultgren',
  'Mi Miley',
  'Isabelle Halperin',
  'Kayla Starke',
  'Allyson Woomer',
  'Sirena Politte',
  'Patricia Scovil',
];

export const getParticipant = sid => {
  const name = participants[(sid | 0) % participants.length];
  return {
    sid,
    name,
    avatar: `https://api.adorable.io/avatars/80/${name.replace(/\s/g, '')}.png`,
  };
};

export const getRandomUser = () => {
  return Math.floor(Math.random() * 10000).toString();
};

// const BASE_URL = 'http://localhost:8080/docs';
const BASE_URL =
  'https://pf-collab-service.ap-southeast-2.dev.atl-paas.net/docs';

export class Channel {
  private eventBus: EventEmitter;
  private io: io;
  private baseUrl: string;
  private docId: string;
  private sid: string;
  private isSending: boolean;

  constructor(baseUrl: string, docId: string, sid: string) {
    this.baseUrl = baseUrl;
    this.docId = docId;
    this.sid = sid;
    this.eventBus = new EventEmitter();
  }

  async connect() {
    /**
     * Get initial document (including version and paricipants) from service
     */
    const { doc, participants, version } = (await req(
      `${this.baseUrl}/${this.docId}`,
    )) as any;

    this.io = io.connect(`${this.baseUrl}/${this.docId}`);
    this.io.on('connect', () => {
      this.eventBus.emit('connected', { doc, participants, version });
      this.io.emit('join', this.sid);
    });

    this.io.on('events', data => {
      this.eventBus.emit('data', data);
    });
  }

  on(evt: CollabEvent, handler: (...args) => void) {
    this.eventBus.on(evt, handler);
    return this;
  }

  async sendTelepointer(selection: any, state: any) {
    const version = getVersion(state);

    // Don't send anything before we're ready.
    if (typeof version === undefined) {
      return;
    }

    const body = JSON.stringify({
      version,
      steps: [],
      clientID: this.sid,
      selection,
    });

    await req(`${this.baseUrl}/${this.docId}/events`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendTransaction(tr: any, state: any) {
    if (this.isSending) {
      return;
    }

    const version = getVersion(state);

    // Don't send anything before we're ready.
    if (typeof version === undefined) {
      return;
    }

    // const { steps = [] } = tr;
    const sendable = sendableSteps(state);
    const steps = sendable ? sendable.steps : [];

    const body = JSON.stringify({
      version,
      steps: steps.map(step => step.toJSON()),
      selection: getSendableSelection(state.selection),
      clientID: this.sid,
    });

    this.isSending = true;

    try {
      await req(`${this.baseUrl}/${this.docId}/events`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.isSending = false;
    } catch (err) {
      this.isSending = false;
    }
  }
}

export type HttpMethod = 'GET' | 'POST';

export interface RequestOptions {
  method: HttpMethod;
  body?: string;
  headers?: any;
}

export const req = (
  url: string,
  options: RequestOptions = { method: 'GET' },
) => {
  return new Promise((resolve, reject) => {
    fetch(new Request(url, options))
      .then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          reject({
            code: response.status,
            reason: response.statusText,
          });
        }
      })
      .catch(reject);
  });
};

export class CollabProvider implements CollabEditProvider {
  protected getState = (): any => {};
  protected createStep = (json: object) => {};
  protected sid;
  protected eventBus: EventEmitter;
  protected channel: Channel;
  protected participants: { sessionId: string }[] = [];

  constructor(sid?: string, docId?: string) {
    this.sid = sid || getRandomUser();
    this.eventBus = new EventEmitter();

    this.channel = new Channel(BASE_URL, docId || 'theDocument', this.sid);
  }

  initialize(getState: () => any, createStep: (json: object) => Step) {
    this.getState = getState;
    this.createStep = createStep;

    this.channel
      .on('connected', ({ doc, participants, version }) => {
        const { sid } = this;

        console.log(`Joined. The document version is ${version}.`);

        // Set initial document - TODO: Fetch this from server
        this.eventBus.emit('init', { sid, doc, version });

        // Let plugin know that we're connected and ready to go
        this.eventBus.emit('connected', { sid });

        if (participants) {
          this.handlePresence(participants);
        }
      })
      .on('data', this.onReceiveData);

    this.channel.connect();
    return this;
  }

  send(tr, oldState, newState) {
    if (!tr.steps || !tr.steps.length) {
      return; // A change we don't care about, such as a cursor move
    }

    this.channel.sendTransaction(tr, newState);
  }

  on(evt: CollabEvent, handler: (...args) => void) {
    this.eventBus.on(evt, handler);
    return this;
  }

  sendMessage(data: any) {
    if (!data) {
      return;
    }

    const { type } = data;

    switch (type) {
      case 'telepointer':
        this.channel.sendTelepointer(data.selection, this.getState());
        break;
    }
  }

  private onReceiveData = data => {
    const { participants, steps, version, clientIDs } = data;

    console.log({ data });

    if (steps && steps.length /* && version > getVersion(this.getState()) */) {
      this.eventBus.emit('data', { json: steps, version, clientIDs });
    }

    if (participants) {
      this.handlePresence(participants);

      if (!clientIDs || clientIDs.indexOf(this.sid) === -1) {
        this.handleTelepointers(participants);
      }
    }
  };

  private handlePresence = participants => {
    const { users = {} } = participants;

    const presence = Object.keys(users).map(key => {
      const { clientID, lastActive, isActive } = users[key];

      // const { avatar, name } = mockParticipants[clientID];
      const { avatar, name } = getParticipant(clientID);

      return {
        lastActive,
        sessionId: clientID,
        avatar,
        name,
        isActive,
      };
    });

    const joined = presence.filter(
      ({ isActive, sessionId }) =>
        isActive && this.participants.indexOf(sessionId) === -1,
    );
    const left = presence
      .filter(
        ({ isActive, sessionId }) =>
          !isActive && this.participants.indexOf(sessionId) !== -1,
      )
      .map(({ sessionId }) => ({ sessionId }));

    const leftMap = left.map(({ sessionId }) => sessionId);

    this.participants = [
      ...this.participants,
      ...joined.map(({ sessionId }) => sessionId),
    ].filter(sessionId => leftMap.indexOf(sessionId) === -1);

    if (joined.length || left.length) {
      this.eventBus.emit('presence', { joined, left });
    }
  };

  private handleTelepointers = participants => {
    const { users = {} } = participants;

    Object.keys(users).forEach(name => {
      const { selection, clientID: sessionId } = users[name];

      if (this.participants.indexOf(sessionId) !== -1) {
        this.eventBus.emit('telepointer', {
          type: 'telepointer',
          selection,
          sessionId,
        });
      }
    });
  };
}
