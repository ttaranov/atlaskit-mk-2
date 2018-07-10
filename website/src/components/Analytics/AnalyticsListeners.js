// @flow
import React from 'react';
import AnalyticsWebClient, {
  envType,
  originType,
  tenantType,
  userType,
  eventType,
  platformType,
} from '@atlassiansox/analytics-web-client';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';
import FeatureFlag from '../FeatureFlag';
import GoogleAnalyticsListener from './GoogleAnalyticsListener';
import { GOOGLE_ANALYTICS_ID } from '../../constants';

const env = websiteEnv => {
  switch (websiteEnv) {
    case 'production':
      return envType.PROD;
    case 'staging':
      return envType.STAGING;
    default:
      return envType.LOCAL;
  }
};

const analyticsClient = new AnalyticsWebClient({
  env: env(WEBSITE_ENV),
  product: 'atlaskitWebsite',
  version: '1.0.0',
  locale: 'en-US',
});

const clientPromise = Promise.resolve(analyticsClient);

const AnalyticsListeners = ({ children }) => {
  return (
    <GoogleAnalyticsListener gaId={GOOGLE_ANALYTICS_ID}>
      <FeatureFlag name="send-analytics-to-pipeline">
        {yes =>
          yes ? (
            <FabricAnalyticsListeners client={clientPromise}>
              {children}
            </FabricAnalyticsListeners>
          ) : (
            children
          )
        }
      </FeatureFlag>
    </GoogleAnalyticsListener>
  );
};

export default AnalyticsListeners;
