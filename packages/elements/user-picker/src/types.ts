import { ActionTypes, ValueType } from 'react-select/lib/types';

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
  lozenge?: string;
}

export type UserValue = ValueType<User>;

export type OnChange = (value: UserValue, action: ActionTypes) => void;

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
