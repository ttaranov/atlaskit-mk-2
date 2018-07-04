import { SyntheticEvent } from 'react';

export interface AkProfilecardTriggerActions {
  callback?: (evt: SyntheticEvent<any>) => void;
  label?: string;
}

export interface ProfileCardAction {
  callback: () => void;
  label: string;
}

export interface ProfilecardProvider {
  cloudId: string;
  resourceClient: any;
  getActions: (
    id: string,
    text: string,
    accessLevel?: string,
  ) => ProfileCardAction[];
}
