// @flow

import type {
  AnalyticsEventPayload,
  AnalyticsEventUpdater,
  AnalyticsEventInterface,
  AnalyticsEventProps,
} from './types';

export default class AnalyticsEvent implements AnalyticsEventInterface {
  payload: AnalyticsEventPayload;

  constructor(props: AnalyticsEventProps) {
    this.payload = props.payload;
  }

  clone = (): AnalyticsEvent => {
    const payload = JSON.parse(JSON.stringify(this.payload));
    return new AnalyticsEvent({ payload });
  };

  update(updater: AnalyticsEventUpdater): this {
    if (typeof updater === 'function') {
      this.payload = updater(this.payload);
    } else if (typeof updater === 'object') {
      this.payload = {
        ...this.payload,
        ...updater,
      };
    }

    return this;
  }
}
