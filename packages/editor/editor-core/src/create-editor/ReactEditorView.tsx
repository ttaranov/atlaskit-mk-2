import * as React from 'react';
import * as PropTypes from 'prop-types';
import { EditorView, DirectEditorProps } from 'prosemirror-view';
import { intlShape } from 'react-intl';

import { EventDispatcher, createDispatch } from '../event-dispatcher';
import { processRawValue } from '../utils';
import createPluginList from './create-plugins-list';
import { EditorState, Transaction, Selection } from 'prosemirror-state';
import { ProviderFactory, Transformer } from '@atlaskit/editor-common';
import { EditorProps, EditorConfig, EditorPlugin } from '../types';
import { PortalProviderAPI } from '../ui/PortalProvider';
import {
  processPluginsList,
  createSchema,
  createErrorReporter,
  createPMPlugins,
  initAnalytics,
} from './create-editor';

export interface EditorViewProps {
  editorProps: EditorProps;
  providerFactory: ProviderFactory;
  portalProviderAPI: PortalProviderAPI;
  render?: (
    props: {
      editor: JSX.Element;
      view?: EditorView;
      config: EditorConfig;
      eventDispatcher: EventDispatcher;
      transformer?: Transformer<string>;
    },
  ) => JSX.Element;
  onEditorCreated: (
    instance: {
      view: EditorView;
      config: EditorConfig;
      eventDispatcher: EventDispatcher;
      transformer?: Transformer<string>;
    },
  ) => void;
  onEditorDestroyed: (
    instance: {
      view: EditorView;
      config: EditorConfig;
      eventDispatcher: EventDispatcher;
      transformer?: Transformer<string>;
    },
  ) => void;
}

export default class ReactEditorView<T = {}> extends React.Component<
  EditorViewProps & T
> {
  view?: EditorView;
  eventDispatcher: EventDispatcher;
  contentTransformer?: Transformer<string>;
  config: EditorConfig;
  editorState: EditorState;

  static contextTypes = {
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
    intl: intlShape,
  };

  constructor(props: EditorViewProps & T) {
    super(props);

    initAnalytics(props.editorProps.analyticsHandler);

    this.editorState = this.createEditorState({ props, replaceDoc: true });
  }

  componentWillReceiveProps(nextProps: EditorViewProps) {
    if (
      this.view &&
      this.props.editorProps.disabled !== nextProps.editorProps.disabled
    ) {
      // Disables the contentEditable attribute of the editor if the editor is disabled
      this.view.setProps({
        editable: state => !nextProps.editorProps.disabled,
      } as DirectEditorProps);
    }
  }

  /**
   * Clean up any non-PM resources when the editor is unmounted
   */
  componentWillUnmount() {
    this.eventDispatcher.destroy();

    if (this.view) {
      // Destroy the state if the Editor is being unmounted
      const editorState = this.view.state;
      editorState.plugins.forEach(plugin => {
        const state = plugin.getState(editorState);
        if (state && state.destroy) {
          state.destroy();
        }
      });
    }
    // this.view will be destroyed when React unmounts in handleEditorViewRef
  }

  // Helper to allow tests to inject plugins directly
  getPlugins(editorProps: EditorProps): EditorPlugin[] {
    return createPluginList(editorProps);
  }

  createEditorState = (options: {
    props: EditorViewProps;
    replaceDoc?: boolean;
  }) => {
    if (this.view) {
      /**
       * There's presently a number of issues with changing the schema of a
       * editor inflight. A significant issue is that we lose the ability
       * to keep track of a user's history as the internal plugin state
       * keeps a list of Steps to undo/redo (which are tied to the schema).
       * Without a good way to do work around this, we prevent this for now.
       */
      // tslint:disable-next-line:no-console
      console.warn(
        'The editor does not support changing the schema dynamically.',
      );
      return this.editorState;
    }

    this.config = processPluginsList(
      this.getPlugins(options.props.editorProps),
      options.props.editorProps,
    );
    const schema = createSchema(this.config);

    const {
      contentTransformerProvider,
      defaultValue,
      errorReporterHandler,
    } = options.props.editorProps;

    this.eventDispatcher = new EventDispatcher();
    const dispatch = createDispatch(this.eventDispatcher);
    const errorReporter = createErrorReporter(errorReporterHandler);

    const plugins = createPMPlugins({
      schema,
      dispatch,
      errorReporter,
      editorConfig: this.config,
      props: options.props.editorProps,
      eventDispatcher: this.eventDispatcher,
      providerFactory: options.props.providerFactory,
      portalProviderAPI: this.props.portalProviderAPI,
      reactContext: () => this.context,
    });

    this.contentTransformer = contentTransformerProvider
      ? contentTransformerProvider(schema)
      : undefined;

    let doc;
    if (options.replaceDoc) {
      doc =
        this.contentTransformer && typeof defaultValue === 'string'
          ? this.contentTransformer.parse(defaultValue)
          : processRawValue(schema, defaultValue);
    }
    let selection: Selection | undefined;
    if (doc) {
      // ED-4759: Don't set selection at end for full-page editor - should be at start
      selection =
        options.props.editorProps.appearance === 'full-page'
          ? Selection.atStart(doc)
          : Selection.atEnd(doc);
    }
    // Workaround for ED-3507: When media node is the last element, scrollIntoView throws an error
    const patchedSelection = selection
      ? Selection.findFrom(selection.$head, -1, true) || undefined
      : undefined;

    return EditorState.create({
      schema,
      plugins,
      doc,
      selection: patchedSelection,
    });
  };

  createEditorView = (node: HTMLDivElement) => {
    // Creates the editor-view from this.editorState. If an editor has been mounted
    // previously, this will contain the previous state of the editor.
    this.view = new EditorView(
      { mount: node },
      {
        state: this.editorState,
        dispatchTransaction: (transaction: Transaction) => {
          transaction.setMeta('isLocal', true);
          if (!this.view) {
            return;
          }

          const editorState = this.view.state.apply(transaction);
          this.view.updateState(editorState);
          if (this.props.editorProps.onChange && transaction.docChanged) {
            this.props.editorProps.onChange(this.view);
          }
          this.editorState = editorState;
        },
        // Disables the contentEditable attribute of the editor if the editor is disabled
        editable: state => !this.props.editorProps.disabled,
        attributes: { 'data-gramm': 'false' },
      },
    );
  };

  handleEditorViewRef = (node: HTMLDivElement) => {
    if (!this.view && node) {
      this.createEditorView(node);
      this.props.onEditorCreated({
        view: this.view!,
        config: this.config,
        eventDispatcher: this.eventDispatcher,
        transformer: this.contentTransformer,
      });
      // Force React to re-render so consumers get a reference to the editor view
      this.forceUpdate();
    } else if (this.view && !node) {
      // When the appearance is changed, React will call handleEditorViewRef with node === null
      // to destroy the old EditorView, before calling this method again with node === div to
      // create the new EditorView
      this.props.onEditorDestroyed({
        view: this.view,
        config: this.config,
        eventDispatcher: this.eventDispatcher,
        transformer: this.contentTransformer,
      });
      this.view.destroy(); // Destroys the dom node & all node views
      this.view = undefined;
    }
  };

  render() {
    const editor = <div key="ProseMirror" ref={this.handleEditorViewRef} />;
    return this.props.render
      ? this.props.render({
          editor,
          view: this.view,
          config: this.config,
          eventDispatcher: this.eventDispatcher,
          transformer: this.contentTransformer,
        })
      : editor;
  }
}
