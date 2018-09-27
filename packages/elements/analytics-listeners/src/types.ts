import Logger from './helpers/logger';

export type AnalyticsWebClient = {
  sendUIEvent: (event: any) => void;
  sendOperationalEvent: (event: any) => void;
  sendTrackEvent: (event: any) => void;
  sendScreenEvent: (event: any) => void;
};

export type ListenerProps = {
  children?: React.ReactNode;
  client?: AnalyticsWebClient;
  logger: Logger;
};

export enum FabricChannel {
  atlaskit = 'atlaskit',
  elements = 'fabric-elements',
  navigation = 'navigation',
  editor = 'editor',
  media = 'media',
}
