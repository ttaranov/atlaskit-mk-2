import { Action } from './ActionsView';

// TODO: in v1.6 move these types into the specific views, then the parent views can import the types from there, like the ^^^ actions

export interface ContextViewModel {
  icon?: string;
  text: string;
}

export interface IconWithTooltip {
  url: string;
  tooltip?: string;
}

export interface TextWithTooltip {
  text: string;
  tooltip?: string;
}

export interface UserViewModel {
  icon?: string;
  name?: string;
  // in the future we might add other things supported by <Avatar/> e.g. href
}

export interface BadgeViewModel {
  value: number;
  max?: number;
  appearance?: 'default' | 'primary' | 'important' | 'added' | 'removed'; // defaults to 'default'
}

export interface LozengeViewModel {
  text: string;
  appearance?:
    | 'default'
    | 'success'
    | 'removed'
    | 'inprogress'
    | 'new'
    | 'moved'; // defaults to 'default'
  isBold?: boolean; // defaults to false
}

export interface DetailViewModel {
  title?: string;
  icon?: string;
  badge?: BadgeViewModel;
  lozenge?: LozengeViewModel;
  text?: string;
  tooltip?: string;
}

export default interface ViewModel {
  context?: ContextViewModel;
  link?: string;
  icon?: IconWithTooltip;
  user?: UserViewModel;
  preview?: string;
  title?: TextWithTooltip;
  description?: TextWithTooltip;
  details?: DetailViewModel[];
  users?: UserViewModel[];
  actions?: Action[];
  onClick?: () => void;
}
