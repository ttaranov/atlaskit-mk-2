import { User } from '../../types';

export interface OverviewScreenProps {
  accessibleSites: AvailableSitesResponse | null;
  isLoading: boolean;
  // tslint:disable-next-line no-any
  getAccessibleSites: (userId: string) => Promise<any>;
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
