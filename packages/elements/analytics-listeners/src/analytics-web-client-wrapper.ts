import { AnalyticsWebClient } from './types';
import {
  GasPayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import Logger from './helpers/logger';

export const sendEvent = (
  client: Promise<AnalyticsWebClient>,
  logger: Logger,
) => (event: GasPayload | GasScreenEventPayload): void => {
  const gasEvent = {
    ...event,
  };
  delete gasEvent.eventType;

  switch (event.eventType) {
    case 'ui':
      logger.debug('Sending UI Event via analytics client', gasEvent);
      client.then(c => c.sendUIEvent(gasEvent));
      break;

    case 'operational':
      logger.debug('Sending Operational Event via analytics client', gasEvent);
      client.then(c => c.sendOperationalEvent(gasEvent));
      break;

    case 'track':
      logger.debug('Sending Track Event via analytics client', gasEvent);
      client.then(c => c.sendTrackEvent(gasEvent));
      break;

    case 'screen':
      logger.debug('Sending Screen Event via analytics client', gasEvent);
      client.then(c => c.sendScreenEvent(gasEvent));
      break;

    default:
      logger.error(
        `cannot map eventType ${
          event.eventType
        } to an analytics-web-client function`,
      );
  }
};
