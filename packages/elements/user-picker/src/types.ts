export interface HighlightRange {
  start: number;
  end: number;
}

export interface Highlight {
  name: HighlightRange[];
  nickname: HighlightRange[];
}

export interface User {
  id: string;
  avatarUrl?: string;
  name?: string;
  nickname: string;
  highlight?: Highlight;
  badge?: string;
  fixed?: boolean;
}

export type UserValue = User | Array<User> | null | undefined;

export type ActionTypes =
  | 'select-option'
  | 'deselect-option'
  | 'remove-value'
  | 'pop-value'
  | 'set-value'
  | 'clear'
  | 'create-option';

export type OnChange = (value: UserValue, action: ActionTypes) => void;

export type OnInputChange = (query?: string) => void;

export type OnPicker = () => void;

export type OnUser = (value: UserValue) => void;

export type UserOption = {
  label: string;
  value: string;
  user: User;
};

export interface LoadOptions {
  (searchText?: string):
    | Promisable<User | User[]>
    | Iterable<Promisable<User[] | User> | User | User[]>;
}

export type Promisable<T> = T | PromiseLike<T>;

export type InputActionTypes =
  | 'set-value'
  | 'input-change'
  | 'input-blur'
  | 'menu-close';
