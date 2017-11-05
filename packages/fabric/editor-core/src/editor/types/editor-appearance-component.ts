import { EditorView } from 'prosemirror-view';
import ProviderFactory from '../../providerFactory';
import { EventDispatcher } from '../event-dispatcher';
import { UIComponentFactory, ReactElement } from '../types';

export interface EditorAppearanceComponentProps {
  onUiReady?: (ref) => void;
  onSave?: (editorView: EditorView) => void;
  onCancel?: (editorView: EditorView) => void;

  providerFactory: ProviderFactory;
  editorView?: EditorView;

  eventDispatcher?: EventDispatcher;

  maxHeight?: number;

  contentComponents?: UIComponentFactory[];
  primaryToolbarComponents?: UIComponentFactory[];
  secondaryToolbarComponents?: UIComponentFactory[];

  customContentComponents?: ReactElement;
  customPrimaryToolbarComponents?: ReactElement;
  customSecondaryToolbarComponents?: ReactElement;

  addonToolbarComponents?: ReactElement;

  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;

  disabled?: boolean;
}
