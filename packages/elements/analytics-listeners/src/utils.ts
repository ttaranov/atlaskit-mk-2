import { AnalyticsWebClient, DispatcherMap } from './types';

export const mapEventTypeToDispatcher = (
  client: AnalyticsWebClient,
): object => {
  const map: DispatcherMap = {};
  map['ui'] = client.sendUIEvent;
  map['operational'] = client.sendOperationalEvent;
  map['track'] = client.sendTrackEvent;
  map['screen'] = client.sendScreenEvent;
  return map;
};
