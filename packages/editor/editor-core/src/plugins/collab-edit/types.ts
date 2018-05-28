import { CollabEditProvider } from '@atlaskit/provider';

export interface CollabEditOptions {
  provider?: Promise<CollabEditProvider>;
  inviteToEditHandler?: (event: Event) => void;
  isInviteToEditButtonSelected?: boolean;
}
