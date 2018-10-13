import { User } from '../../types';

export interface DeleteUserOverviewScreenProps {
  accessibleSites: AvailableSitesResponse;
  isCurrentUser: boolean;
  user: User;
}

interface AvailableSitesResponse {
  sites: Sites[];
}

interface Sites {
  cloudId: string;
  url: string;
  products: string[];
  avatarUrl: string;
  displayName: string;
  isVertigo: boolean;
}
