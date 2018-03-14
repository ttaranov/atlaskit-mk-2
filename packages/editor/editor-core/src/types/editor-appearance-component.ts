import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { EventDispatcher } from '../event-dispatcher';
import EditorActions from '../actions';
import {
  UIComponentFactory,
  ReactElement,
  InsertMenuCustomItem,
  ExtensionHandlers,
} from '../types';

export interface EditorAppearanceComponentProps {
  onUiReady?: (ref) => void;
  onSave?: (editorView: EditorView) => void;
  onCancel?: (editorView: EditorView) => void;

  providerFactory: ProviderFactory;
  editorActions?: EditorActions;
  editorDOMElement: JSX.Element;
  editorView?: EditorView;

  eventDispatcher?: EventDispatcher;

  maxHeight?: number;

  contentComponents?: UIComponentFactory[];
  primaryToolbarComponents?: UIComponentFactory[];
  secondaryToolbarComponents?: UIComponentFactory[];

  customContentComponents?: ReactElement;
  customPrimaryToolbarComponents?: ReactElement;
  customSecondaryToolbarComponents?: ReactElement;
  insertMenuItems?: InsertMenuCustomItem[];

  addonToolbarComponents?: ReactElement;

  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;

  extensionHandlers: ExtensionHandlers;

  disabled?: boolean;
}
