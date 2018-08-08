import FabricAnalyticsListeners from './FabricAnalyticsListeners';
import { ELEMENTS_CHANNEL } from './FabricElementsListener';
import { ATLASKIT_CHANNEL } from './atlaskit/AtlaskitListener';

export { LOG_LEVEL } from './helpers/logger';

export const FABRIC_CHANNELS: {
  atlaskit: typeof ATLASKIT_CHANNEL;
  elements: typeof ELEMENTS_CHANNEL;
} = {
  atlaskit: ATLASKIT_CHANNEL,
  elements: ELEMENTS_CHANNEL,
};

export default FabricAnalyticsListeners;
