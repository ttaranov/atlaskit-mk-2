import { sendEvent } from '../analytics-web-client-wrapper';
import { Client } from '../types';
import Logger from '../helpers/logger';
import { processEventPayload } from './process-event-payload';
import { event } from './types';

export const handleEvent = (
  event: event,
  tag: string,
  client: Client,
  logger: Logger,
) => {
  if (!event.payload) {
    return;
  }
  const payload = processEventPayload(event, tag);
  sendEvent(client, logger)(payload);
};
