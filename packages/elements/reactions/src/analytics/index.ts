import { createAndFireEvent } from '@atlaskit/analytics-next';
import { CreateAndFireEventFunction } from '@atlaskit/analytics-next-types';

export const createAndFireEventInElementsChannel: CreateAndFireEventFunction = createAndFireEvent(
  'fabric-elements',
);
