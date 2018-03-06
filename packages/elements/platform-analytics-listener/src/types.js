// @flow

type ObjectType = { [string]: any };

export type AnalyticsClient = {
  sendUIEvent(ObjectType): void,
};
