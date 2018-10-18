import * as React from 'react';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory, ErrorReporter } from '@atlaskit/editor-common';
import { Dispatch, EventDispatcher } from '../event-dispatcher';
import EditorActions from '../actions';
import { ToolbarSize } from '../ui/Toolbar';
import { QuickInsertHandler } from '../plugins/quick-insert/types';
import { TypeAheadHandler } from '../plugins/type-ahead/types';
import { FloatingToolbarHandler } from '../plugins/floating-toolbar/types';
import { PortalProviderAPI } from '../ui/PortalProvider';
import { NodeConfig, MarkConfig } from './editor-config';
import { EditorProps, EditorAppearance } from './editor-props';

export type PMPluginFactory = (
  params: {
    schema: Schema;
    props: EditorProps;
    dispatch: Dispatch;
    eventDispatcher: EventDispatcher;
    providerFactory: ProviderFactory;
    errorReporter: ErrorReporter;
    portalProviderAPI: PortalProviderAPI;
    reactContext: () => { [key: string]: any };
  },
) => Plugin | undefined;

export type UiComponentFactoryParams = {
  editorView: EditorView;
  editorActions: EditorActions;
  eventDispatcher: EventDispatcher;
  providerFactory: ProviderFactory;
  appearance: EditorAppearance;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  containerElement: HTMLElement | undefined;
  disabled: boolean;
};

export type ToolbarUiComponentFactoryParams = UiComponentFactoryParams & {
  toolbarSize: ToolbarSize;
  isToolbarReducedSpacing: boolean;
};

export type UIComponentFactory = (
  params: UiComponentFactoryParams,
) => React.ReactElement<any> | null;

export type ToolbarUIComponentFactory = (
  params: ToolbarUiComponentFactoryParams,
) => React.ReactElement<any> | null;

export type PluginsOptions = {
  [pluginName: string]: any;
  quickInsert?: QuickInsertHandler;
  typeAhead?: TypeAheadHandler;
  floatingToolbar?: FloatingToolbarHandler;
};

export interface EditorPlugin {
  /**
   * Name of a plugin, that other plugins can use to provide options to it.
   */
  name?: string;

  /**
   * Options that will be passed to a plugin with a corresponding name if it exists and enabled.
   */
  pluginsOptions?: PluginsOptions;

  /**
   * List of ProseMirror-plugins. This is where we define which plugins will be added to EditorView (main-plugin, keybindings, input-rules, etc.).
   */
  pmPlugins?: (
    pluginOptions?: any,
  ) => { name: string; plugin: PMPluginFactory }[];

  /**
   * List of Nodes to add to the schema.
   */
  nodes?: (editorProps: EditorProps) => NodeConfig[];

  /**
   * List of Marks to add to the schema.
   */
  marks?: (editorProps: EditorProps) => MarkConfig[];

  /**
   * Optional UI-component that lives inside the actual content-area (like mention-picker, floating toolbar for links, etc.)
   */
  contentComponent?: UIComponentFactory;

  /**
   * Optional UI-component that will be added to the toolbar at the top of the editor (doesn't exist in the compact-editor).
   */
  primaryToolbarComponent?: ToolbarUIComponentFactory;

  /**
   * Optional UI-component that will be added to the toolbar at the bottom right of the editor. (doesn't exist in the full-page editor)
   * In compact mode this toolbar lives on the right-hand side of the editor.
   */
  secondaryToolbarComponent?: UIComponentFactory;
}
