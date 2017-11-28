export interface SmartCardResponse {
  link?: SmartCardLink;
  title: SmartCardTitle;
  description?: SmartCardDescription;
  details?: SmartCardDetails[];
  context?: SmartCardContext;
  preview?: { url: string }; // an image URL
  background?: { url: string }; // an image URL
}

export interface SmartCardLink {
  url: string;
}

export interface SmartCardTitle {
  text: string;
  user?: SmartCardUser;
  lozenge?: SmartCardLozenge;
}

export interface SmartCardDescription {
  title?: string; // the bolded bit
  text: string;
}

export interface SmartCardIcon {
  url: string; // an image URL
  label: string; // accessibility text e.g. tooltip or voiceover
}

export interface SmartCardUser {
  icon: SmartCardIcon;
}

export interface SmartCardBadge {
  value: number;
  max?: number;
  theme?: 'default' | 'dark';
  appearance?: 'default' | 'primary' | 'important' | 'added' | 'removed';
}

export interface SmartCardLozenge {
  text: string;
  bold?: boolean;
  appearance?:
    | 'default'
    | 'success'
    | 'removed'
    | 'inprogress'
    | 'new'
    | 'moved';
}

export interface SmartCardDetails {
  title?: string;
  icon?: SmartCardIcon;
  badge?: SmartCardBadge;
  lozenge?: SmartCardLozenge;
  users?: SmartCardUser[];
  text?: string;
}

export interface SmartCardContext {
  text: string;
  icon?: SmartCardIcon;
}
