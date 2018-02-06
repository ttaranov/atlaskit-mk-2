// @flow

import AnalyticsEvent from './AnalyticsEvent';
import UIAnalyticsEvent from './UIAnalyticsEvent';

// Utils
export type ObjectType = { [string]: any };

// Basic events
export type AnalyticsEventPayload = ObjectType;

export type AnalyticsEventUpdater =
  | AnalyticsEventPayload
  | ((payload: AnalyticsEventPayload) => AnalyticsEventPayload);

export type AnalyticsEventProps = {
  action: string,
  payload: {},
};

export interface AnalyticsEventInterface {
  action: string;
  payload: AnalyticsEventPayload;

  clone: () => AnalyticsEvent;
  update(updater: AnalyticsEventUpdater): AnalyticsEvent;
}

// UI events
type ChannelIdentifier = string;

export type UIAnalyticsEventHandlerSignature = (
  event: UIAnalyticsEvent,
  channel?: ChannelIdentifier,
) => void;

export type UIAnalyticsEventProps = AnalyticsEventProps & {
  context?: Array<ObjectType>,
  handlers?: Array<UIAnalyticsEventHandlerSignature>,
};

export interface UIAnalyticsEventInterface {
  action: string;
  context: Array<ObjectType>;
  handlers?: Array<UIAnalyticsEventHandlerSignature>;
  hasFired: boolean;
  payload: AnalyticsEventPayload;

  clone: () => UIAnalyticsEvent | null;
  fire(channel?: ChannelIdentifier): void;
  update(updater: AnalyticsEventUpdater): AnalyticsEvent;
}
