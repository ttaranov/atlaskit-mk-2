import herment from '../../lib/herment';
import { UserEvent } from './events';

export type UserEventName = string;
export type UserEventProperties = {
  [key: string]: string | number | boolean;
};

export class UserTracker {
  defaults: Object;
  queue: Array<any>;
  queueProcessor: any;
  defaultProperties: UserEventProperties;

  constructor() {
    this.defaults = {
      storage_key: 'media-picker.herment.storage',
      product: 'media-picker',
      subproduct: 'library',
      version: '1.0',
    };
    this.queue = [];
    this.queueProcessor = herment(
      Object.assign({}, this.defaults, { queue: this.queue }),
    );
    if (this.queueProcessor) {
      this.queueProcessor.start();
    }

    this.defaultProperties = {};
  }

  public track(): any {
    return (userEvent: UserEvent) => {
      const event = userEvent.toJSON();
      event.properties = Object.assign(
        {},
        this.defaultProperties,
        event.properties,
      );
      this.queue.push(event);
    };
  }
}
