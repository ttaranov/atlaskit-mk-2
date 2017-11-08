import { EventEmitter } from 'events';
import { CollabEditProvider, CollabEvent } from '../src/editor/plugins/collab-edit/provider';

export class MockCollabEditProvider implements CollabEditProvider {
  protected getState = () => {};
  protected eventBus: EventEmitter = new EventEmitter();

  initialize(getState: () => any) {
    this.getState = getState;
    const doc = {
      'type': 'doc',
      'content': [
        {
          'type': 'paragraph',
          'content': [
            {
              'type': 'text',
              'text': 'Hello World'
            }
          ]
        }
      ]
    };

    this.eventBus.emit('init', { doc });

    return this;
  }

  send(tr, oldState, newState) {
    if (tr.steps && tr.steps.length) {
      const json = tr.steps.map(step => step.toJSON());
      this.eventBus.emit('data', { json });
    }
  }

  on(evt: CollabEvent, handler: (...args) => void) {
    this.eventBus.on(evt, handler);
    return this;
  }

  /**
   * Only used for testing.
   */
  emit(evt: CollabEvent, ...args) {
    this.eventBus.emit(evt, ...args);
  }

  sendMessage(data: any) {
  }
}

export const collabEditProvider = new MockCollabEditProvider();
export const collabEditProviderPromise = Promise.resolve(collabEditProvider);
