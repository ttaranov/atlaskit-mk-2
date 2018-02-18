import * as React from 'react';
import { EditorView, DirectEditorProps } from 'prosemirror-view';
import { EventDispatcher, createDispatch } from '../event-dispatcher';
import { processRawValue } from '../utils';
import createPluginList from './create-plugins-list';
import { EditorState, Transaction, Selection } from 'prosemirror-state';
import { EditorProps, EditorConfig, EditorPlugin } from '../types';
import { ProviderFactory, Transformer } from '@atlaskit/editor-common';
import {
  processPluginsList,
  createSchema,
  createErrorReporter,
  createPMPlugins,
  reconfigureState,
  initAnalytics,
} from './create-editor';

export interface EditorViewProps {
  editorProps: EditorProps;
  providerFactory: ProviderFactory;
  render?: (
    props: {
      editor: JSX.Element;
      state: EditorState;
      view?: EditorView;
      config: EditorConfig;
      eventDispatcher: EventDispatcher;
      transformer?: Transformer<string>;
    },
  ) => JSX.Element;
  onEditorCreated: (
    instance: {
      state: EditorState;
      view: EditorView;
      config: EditorConfig;
      eventDispatcher: EventDispatcher;
      transformer?: Transformer<string>;
    },
  ) => void;
  onEditorDestroyed: (
    instance: {
      state: EditorState;
      view: EditorView;
      config: EditorConfig;
      eventDispatcher: EventDispatcher;
      transformer?: Transformer<string>;
    },
  ) => void;
}

export interface EditorViewState {
  editorState: EditorState;
}

export default class ReactEditorView<T = {}> extends React.Component<
  EditorViewProps & T,
  EditorViewState
> {
  view?: EditorView;
  eventDispatcher: EventDispatcher;
  contentTransformer?: Transformer<string>;
  config: EditorConfig;

  constructor(props: EditorViewProps & T) {
    super(props);

    initAnalytics(props.editorProps.analyticsHandler);

    this.state = {
      editorState: this.createEditorState({ props, replaceDoc: true }),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props === nextProps &&
      this.state.editorState !== nextState.editorState
    ) {
      return false;
    }
    return true;
  }

  componentWillReceiveProps(nextProps: EditorViewProps) {
    if (
      this.props.editorProps.appearance !== nextProps.editorProps.appearance
    ) {
      this.setState(prevState => ({
        editorState: this.createEditorState({
          props: this.props,
          state: prevState,
        }),
      }));
    }

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
      this.state.editorState.plugins.forEach(plugin => {
        const state = plugin.getState(this.state.editorState);
        if (state && state.destroy) {
          state.destroy();
        }
      });

      this.view.destroy();
    }
  }

  getPlugins(editorProps: EditorProps): EditorPlugin[] {
    return createPluginList(editorProps);
  }

  /**
   * Construct the initial editor state from the EditorProps.
   * If an EditorView already exists, it will reconstruct the state
   * from the given props and state to (ideally) seamlessly transition
   * state between EditorViews
   */
  createEditorState = (options: {
    props: EditorViewProps;
    state?: EditorViewState;
    replaceDoc?: boolean;
  }) => {
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
    const plugins = createPMPlugins(
      this.config,
      schema,
      options.props.editorProps,
      dispatch,
      options.props.providerFactory,
      errorReporter,
    );

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

    if (this.view && this.view.state.schema !== schema) {
      return reconfigureState(options.state!.editorState, schema, plugins, doc);
    }

    return EditorState.create({
      schema,
      plugins,
      doc,
      selection: doc ? Selection.atEnd(doc) : undefined,
    });
  };

  createEditorView = node => {
    if (!this.view && node) {
      this.view = new EditorView(node, {
        state: this.state.editorState,
        dispatchTransaction: this.dispatchTransaction,
        // Disables the contentEditable attribute of the editor if the editor is disabled
        editable: state => !this.props.editorProps.disabled,
      });
      this.props.onEditorCreated({
        view: this.view,
        state: this.state.editorState,
        config: this.config,
        eventDispatcher: this.eventDispatcher,
        transformer: this.contentTransformer,
      });
      this.forceUpdate();
    } else if (this.view && !node) {
      this.props.onEditorDestroyed({
        view: this.view,
        state: this.state.editorState,
        config: this.config,
        eventDispatcher: this.eventDispatcher,
        transformer: this.contentTransformer,
      });
      this.view = undefined;
    }
  };

  dispatchTransaction = (transaction: Transaction) => {
    transaction.setMeta('isLocal', true);
    const editorState = this.view!.state.apply(transaction);
    this.view!.updateState(editorState);
    if (this.props.editorProps.onChange && transaction.docChanged) {
      this.props.editorProps.onChange(this.view!);
    }
    this.setState({ editorState });
  };

  render() {
    const editor = <div ref={this.createEditorView} />;
    return this.props.render
      ? this.props.render({
          editor,
          state: this.state.editorState,
          view: this.view,
          config: this.config,
          eventDispatcher: this.eventDispatcher,
          transformer: this.contentTransformer,
        })
      : editor;
  }
}
