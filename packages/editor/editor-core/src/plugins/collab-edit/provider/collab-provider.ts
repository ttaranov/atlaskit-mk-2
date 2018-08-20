import { EventEmitter2 } from 'eventemitter2';
import { getVersion } from 'prosemirror-collab';
import { Transaction, EditorState } from 'prosemirror-state';
import {
  CollabEditProvider,
  CollabEvent,
  PubSubClient,
  StepResponse,
  Config,
} from './types';
import { Channel } from './channel';
import { logger } from './';

export class CollabProvider implements CollabEditProvider {
  private eventEmitter: EventEmitter2 = new EventEmitter2();
  private channel: Channel;
  private queue: StepResponse[] = [];
  private config: Config;

  private getState = (): any => {};

  constructor(config: Config, pubSubClient: PubSubClient) {
    this.config = config;
    this.channel = new Channel(config, pubSubClient);
  }

  initialize(getState: () => any) {
    this.getState = getState;

    this.channel
      .on('connected', ({ doc, version }) => {
        logger(`Joined collab-session. The document version is ${version}`);
        const { userId } = this.config;

        this.emit('init', { sid: userId, doc, version }) // Set initial document
          .emit('connected', { sid: userId }); // Let the plugin know that we're connected an ready to go
      })
      .on('data', this.onReceiveData)
      .connect();

    return this;
  }

  /**
   * Send steps from transaction to other participants
   */
  send(tr: Transaction, oldState: EditorState, newState: EditorState) {
    // Ignore transactions without steps
    if (!tr.steps || !tr.steps.length) {
      return;
    }

    this.channel.sendSteps(newState, this.getState);
  }

  /**
   * Send arbitrary messages, such as telepointers, to other
   * participants.
   */
  sendMessage(data: any) {}

  private queueData(data: StepResponse) {
    logger(`Queuing data for version ${data.version}`);
    const orderedQueue = [...this.queue, data].sort(
      (a, b) => (a.version > b.version ? 1 : -1),
    );

    this.queue = orderedQueue;
  }

  private processQeueue() {
    logger(`Looking for proccessable data`);

    if (this.queue.length === 0) {
      return;
    }

    const [firstItem] = this.queue;
    const currentVersion = getVersion(this.getState());
    const expectedVersion = currentVersion + firstItem.steps.length;

    if (firstItem.version === expectedVersion) {
      logger(`Applying data from queue!`);
      this.queue.splice(0, 1);
      this.processRemoteData(firstItem);
    }
  }

  private processRemoteData = (data: StepResponse) => {
    const { version, steps } = data;

    logger(`Processing data. Version: ${version}`);

    if (steps && steps.length) {
      const userIds = steps.map(step => step.userId);
      this.emit('data', { json: steps, version, userIds });
    }

    this.processQeueue();
  };

  private onReceiveData = (data: StepResponse) => {
    const currentVersion = getVersion(this.getState());
    const expectedVersion = currentVersion + data.steps.length;

    if (data.version === currentVersion) {
      logger(`Received data we already have. Ignoring.`);
    } else if (data.version === expectedVersion) {
      this.processRemoteData(data);
    } else if (data.version > expectedVersion) {
      logger(
        `Version too high. Expected ${expectedVersion} but got ${
          data.version
        }. Current local version is ${currentVersion}`,
      );
      this.queueData(data);
    }
  };

  /**
   * Emit events to subscribers
   */
  private emit(evt: CollabEvent, data: any) {
    this.eventEmitter.emit(evt, data);
    return this;
  }

  /**
   * Subscribe to events emitted by this provider
   */
  on(evt: CollabEvent, handler: (...args) => void) {
    this.eventEmitter.on(evt, handler);
    return this;
  }

  /**
   * Unsubscribe from events emitted by this provider
   */
  off(evt: CollabEvent, handler: (...args) => void) {
    this.eventEmitter.off(evt, handler);
    return this;
  }
}
