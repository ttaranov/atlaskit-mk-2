import { ResourceProvider, PresenceMap } from './types';

export default interface PresenceProvider
  extends ResourceProvider<PresenceMap> {
  refreshPresence(userIds: string[]): void;
};
