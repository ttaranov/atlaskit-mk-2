/*
  I'd love to use a namespace for these types... but linting says no :(
*/

export interface LinkViewModel {
  url: string; // will be used for primary click action on card
}

export interface IconViewModel {
  url: string;
  label?: string;
}

export interface ContextViewModel {
  text: string;
  icon?: IconViewModel;
}

export interface PreviewViewModel {
  url: string;
}

export interface TextWithLabel {
  text: string;
  label?: string; // accessibility text e.g. tooltip or voiceover
}

export interface TitleViewModel {
  title: TextWithLabel;
  text: TextWithLabel;
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
  icon?: IconViewModel;
  badge?: BadgeViewModel;
  lozenge?: LozengeViewModel;
  text?: string;
  label?: string;
}

export interface ActionViewModel {
  title: string;
  target: any;
}

export interface UserViewModel {
  icon: IconViewModel;
}

export default interface ViewModel {
  context?: ContextViewModel;
  link?: LinkViewModel;
  icon?: IconViewModel;
  user?: UserViewModel;
  preview?: PreviewViewModel;
  title?: TitleViewModel;
  details?: DetailViewModel[];
  users?: UserViewModel[];
  actions?: ActionViewModel[];
  onAction?: (target: any) => void;
};
