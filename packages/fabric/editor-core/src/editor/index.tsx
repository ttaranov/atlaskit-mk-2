import * as React from 'react';
import { PropTypes } from 'react';
import { withAnalytics } from '@atlaskit/analytics';
import { createEditor, getUiComponent } from './create-editor';
import { createPluginsList } from './create-editor';
import EditorActions from './actions';
import ProviderFactory from '../providerFactory';
import { EditorProps, EditorInstance } from './types';
import { moveCursorToTheEnd } from '../utils';
export * from './types';

export interface State {
  editor?: EditorInstance;
}

export default class Editor extends React.Component<EditorProps, State> {
  static defaultProps: EditorProps = {
    appearance: 'message',
    disabled: false
  };

  static contextTypes = {
    editorActions: PropTypes.object
  };

  context: {
    editorActions?: EditorActions;
  };

  private providerFactory: ProviderFactory;

  constructor(props: EditorProps) {
    super(props);
    this.providerFactory = new ProviderFactory();
    this.state = {};
  }

  componentDidMount() {
    this.handleProviders(this.props);
  }

  componentWillReceiveProps(nextProps: EditorProps) {
    this.handleProviders(nextProps);
  }

  componentWillUnmount() {
    if (!this.state.editor) {
      return;
    }

    const { editor } = this.state;
    const { editorView } = editor;
    const { state: editorState } = editorView;

    this.unregisterEditorFromActions();

    editorState.plugins.forEach(plugin => {
      const state = plugin.getState(editor.editorView.state);
      if (state && state.destroy) {
        state.destroy();
      };
    });

    editorView.destroy();

    if (editor.eventDispatcher) {
      editor.eventDispatcher.destroy();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { editor } = this.state;
    // Once the editor has been set for the first time
    if (!prevState.editor && editor) {
      // Focus editor first time we create it if shouldFocus prop is set to true.
      if (this.props.shouldFocus) {
        if (!editor.editorView.hasFocus()) {
          editor.editorView.focus();
        }

        moveCursorToTheEnd(editor.editorView);
      }
    }
    if (editor) {
      if (!editor.editorView.hasFocus()) {
        editor.editorView.focus()
      }
      moveCursorToTheEnd(editor.editorView);
    }
  }

  private registerEditorForActions(editor: EditorInstance) {
    if (this.context && this.context.editorActions) {
      this.context.editorActions._privateRegisterEditor(editor.editorView, editor.contentTransformer);
    }
  }

  private unregisterEditorFromActions() {
    if (this.context && this.context.editorActions) {
      this.context.editorActions._privateUnregisterEditor();
    }
  }

  private initEditor = place => {
    if (!place) {
      return;
    }
    const plugins = createPluginsList(this.props);
    const editor = createEditor(place, plugins, this.props, this.providerFactory);
    this.registerEditorForActions(editor);
    this.setState({ editor });
  }

  private handleProviders(props: EditorProps) {
    const {
      emojiProvider,
      mentionProvider,
      mediaProvider,
      collabEditProvider,
      activityProvider,
      presenceProvider,
      macroProvider,
      legacyImageUploadProvider
    } = props;
    this.providerFactory.setProvider('emojiProvider', emojiProvider);
    this.providerFactory.setProvider('mentionProvider', mentionProvider);
    this.providerFactory.setProvider('mediaProvider', mediaProvider);
    this.providerFactory.setProvider('imageUploadProvider', legacyImageUploadProvider);
    this.providerFactory.setProvider('collabEditProvider', collabEditProvider);
    this.providerFactory.setProvider('activityProvider', activityProvider);
    this.providerFactory.setProvider('presenceProvider', presenceProvider);
    this.providerFactory.setProvider('macroProvider', macroProvider);
  }

  render() {
    // tslint:disable-next-line:variable-name
    const { editor = {} } = this.state;

    const Component = getUiComponent(this.props.appearance);

    if (!Component) {
      return null;
    }

    const {
      editorView,
      contentComponents,
      primaryToolbarComponents,
      secondaryToolbarComponents,
      eventDispatcher
    } = editor as EditorInstance;

    return (
      <Component
        onUiReady={this.initEditor}

        disabled={this.props.disabled}

        editorView={editorView}
        providerFactory={this.providerFactory}

        eventDispatcher={eventDispatcher}

        maxHeight={this.props.maxHeight}
        onSave={this.props.onSave}
        onCancel={this.props.onCancel}

        popupsMountPoint={this.props.popupsMountPoint}
        popupsBoundariesElement={this.props.popupsBoundariesElement}

        contentComponents={contentComponents}
        primaryToolbarComponents={primaryToolbarComponents}
        secondaryToolbarComponents={secondaryToolbarComponents}

        customContentComponents={this.props.contentComponents}
        customPrimaryToolbarComponents={this.props.primaryToolbarComponents}
        customSecondaryToolbarComponents={this.props.secondaryToolbarComponents}

        addonToolbarComponents={this.props.addonToolbarComponents}
      />
    );
  }
}

export const EditorWithAnalytics = withAnalytics<typeof Editor>(Editor, {}, {}, true);
