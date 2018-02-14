// @flow

import cloneDeep from 'clone-deep';

import type {
  AnalyticsEventUpdater,
  AnalyticsEventInterface,
  AnalyticsEventProps,
} from './types';

export default class AnalyticsEvent implements AnalyticsEventInterface {
  payload: {};

  constructor(props: AnalyticsEventProps) {
    this.payload = props.payload;
  }

  clone = (): AnalyticsEvent => {
    const payload = cloneDeep(this.payload);
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
