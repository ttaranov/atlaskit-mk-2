import { EventEmitter2 } from 'eventemitter2';
import { getVersion } from 'prosemirror-collab';
import { Transaction, EditorState } from 'prosemirror-state';
import {
  CollabEditProvider,
  CollabEvent,
  PubSubClient,
  StepResponse,
  Config,
  TelepointerData,
  Participant,
} from './types';
import { Channel } from './channel';
import { logger } from './';
import { getParticipant } from './mock-users';

export class CollabProvider implements CollabEditProvider {
  private eventEmitter: EventEmitter2 = new EventEmitter2();
  private channel: Channel;
  private queue: StepResponse[] = [];
  private config: Config;

  private getState = (): any => {};

  private participants: Map<string, Participant> = new Map();

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
      .on('telepointer', this.onReceiveTelepointer)
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
   * Send messages, such as telepointers, to other participants.
   */
  sendMessage(data: any) {
    if (!data) {
      return;
    }

    const { type } = data;
    switch (type) {
      case 'telepointer':
        this.channel.sendTelepointer({
          ...data,
          timestamp: new Date().getTime(),
        });
    }
  }

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

  private onReceiveTelepointer = (
    data: TelepointerData & { timestamp: number },
  ) => {
    const { sessionId } = data;

    if (sessionId === this.config.userId) {
      return;
    }

    const participant = this.participants.get(sessionId);

    if (participant && participant.lastActive > data.timestamp) {
      logger(`Old telepointer event. Ignoring.`);
      return;
    }

    this.updateParticipant(sessionId, data.timestamp);
    logger(`Remote telepointer from ${sessionId}`);

    this.emit('telepointer', data);
  };

  private updateParticipant(userId: string, timestamp: number) {
    // TODO: Make batch-request to backend to resolve participants
    const { name = '', email = '', avatar = '' } = getParticipant(userId);

    this.participants.set(userId, {
      name,
      email,
      avatar,
      sessionId: userId,
      lastActive: timestamp,
    });

    const joined = [this.participants.get(userId)];

    // Filter out participants that's been inactive for
    // more than 5 minutes.

    const now = new Date().getTime();
    const left = Array.from(this.participants.values()).filter(
      p => (now - p.lastActive) / 1000 > 300,
    );

    left.forEach(p => this.participants.delete(p.sessionId));

    this.emit('presence', { joined, left });
  }

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
