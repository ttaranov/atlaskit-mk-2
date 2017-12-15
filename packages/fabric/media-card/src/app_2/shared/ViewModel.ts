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

export interface ActionViewModel {
  text: string;

  // I chose an action handler over a generic data blob because there's no ambiguity in which action the
  // blob originated from when multiple actions contain the same blob - edge case I know, but why not
  handler: () => void;
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
  actions?: ActionViewModel[];
  onClick?: () => void;
};
