import { User } from '../../types';

export interface OverviewScreenProps {
  accessibleSites: AvailableSitesResponse;
  // tslint:disable-next-line no-any
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
