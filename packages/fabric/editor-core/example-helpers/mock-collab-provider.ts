import { EventEmitter } from 'events';
import {
  CollabEditProvider,
  CollabEvent
} from '../src/editor/plugins/collab-edit/provider';

interface Participant {
  sid: string;
  name: string;
  src: string;
}

const participants = {
  rick: {
    sid: 'rick',
    name: 'Rick Sanchez',
    avatar:
      'https://pbs.twimg.com/profile_images/897250392022540288/W1T-QjML_400x400.jpg'
  },
  morty: {
    sid: 'morty',
    name: 'Morty Smith',
    avatar:
      'https://pbs.twimg.com/profile_images/685489227082129408/YhGfwW73_400x400.png'
  },
  summer: {
    sid: 'sumsum',
    name: 'Summer Smith',
    avatar:
      'https://pbs.twimg.com/profile_images/878646716328812544/dYdU_OKZ_400x400.jpg'
  }
};

const others = (sid: string) =>
  Object.keys(participants).reduce<Participant[]>(
    (all, id) => (id === sid ? all : all.concat(participants[id])),
    []
  );

class Mediator extends EventEmitter {
  emit(eventName, data, ...args) {
    switch (eventName) {
      case 'init': {
        const { sid, doc } = data as any;
        this.emit(`${sid}:init`, { doc });
        this.emit(`${sid}:connected`, { sid });
        const collaborators = others(sid);
        const joined = collaborators.map(({ sid: sessionId, ...rest }) => ({
          sessionId,
          ...rest,
          lastActive: 0
        }));
        collaborators.forEach(({ sid: xSid }) => {
          setTimeout(() => {
            this.emit(`${xSid}:presence`, { joined });
          }, 0);
        });
        return;
      }
      case 'data':
      case 'telepointer': {
        const { sid, ...rest } = data as any;
        others(sid).forEach(({ sid }) => {
          this.emit(`${sid}:${eventName}`, { ...rest });
        });
        return;
      }
    }
    super.emit(eventName, data, ...args);
  }
}

const mediator = new Mediator();

export class MockCollabEditProvider implements CollabEditProvider {
  protected getState = () => {};
  protected sid;
  protected eventBus: EventEmitter;

  constructor(eventBus: EventEmitter, sid?: string) {
    // If there's no sid then it's single user, being used for test
    if (sid) {
      this.sid = sid;
      this.eventBus = eventBus;
    } else {
      this.eventBus = new EventEmitter();
    }
  }

  initialize(getState: () => any) {
    this.getState = getState;
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World'
            }
          ]
        }
      ]
    };

    const { sid } = this;
    this.eventBus.emit('init', { sid, doc });

    return this;
  }

  send(tr, oldState, newState) {
    if (tr.steps && tr.steps.length) {
      const json = tr.steps.map(step => step.toJSON());
      this.eventBus.emit('data', { json });
    }
  }

  on(evt: CollabEvent, handler: (...args) => void) {
    const { sid } = this;
    if (sid) {
      this.eventBus.on(`${sid}:${evt}`, handler);
    } else {
      this.eventBus.on(evt, handler);
    }
    return this;
  }

  emit(evt: CollabEvent, ...args) {
    const { sid } = this;
    if (sid) {
      this.eventBus.emit(evt, { sid, ...args });
    } else {
      this.eventBus.emit(evt, ...args);
    }
  }

  sendMessage(data: any) {
    const { sid } = this;
    if (sid) {
      this.eventBus.emit(`${data.type}`, { sid, ...data });
    }
  }
}

const getCollabEditProviderFor = <T>(participants: T) => (sid?: keyof T) =>
  Promise.resolve(new MockCollabEditProvider(mediator, sid));

export const collabEditProvider = getCollabEditProviderFor(participants);
