import { EditorView } from 'prosemirror-view';
import { UIComponentFactory } from './editor-plugin';
import { EventDispatcher } from '../event-dispatcher';
import { Transformer } from '@atlaskit/editor-common';
import { InsertMenuCustomItem } from '../types';

export interface EditorInstance {
  editorView: EditorView;
  eventDispatcher: EventDispatcher;
  contentComponents: UIComponentFactory[];
  primaryToolbarComponents: UIComponentFactory[];
  secondaryToolbarComponents: UIComponentFactory[];
  contentTransformer?: Transformer<string>;
  insertMenuItems?: InsertMenuCustomItem[];
}
