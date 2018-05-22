import { AnalyticsWebClient } from './types';
import { GasPayload } from '@atlaskit/analytics-gas-types';

export const sendEvent = (client: AnalyticsWebClient) => (
  event: GasPayload,
): void => {
  const gasEvent = {
    ...event,
  };
  delete gasEvent.eventType;

  switch (event.eventType) {
    case 'ui':
      client.sendUIEvent(gasEvent);
      break;

    case 'operational':
      client.sendOperationalEvent(gasEvent);
      break;

    case 'track':
      client.sendTrackEvent(gasEvent);
      break;

    case 'screen':
      client.sendScreenEvent(gasEvent);
      break;

    default:
      throw Error(
        `cannot map eventType ${
          event.eventType
        } to an analytics-web-client function`,
      );
  }
};
