import { Fragment } from 'prosemirror-model';

export interface Serializer<T> {
  serializeFragment(fragment: Fragment): T | null;
}
