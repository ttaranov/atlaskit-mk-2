import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { MacroProvider } from '../../editor/plugins/macro';
import InlineExtension from './InlineExtension';
import Extension from './Extension';
import { ExtensionHandlers } from '../../editor/types';
import EditorActions from '../../editor/actions';

export interface Props {
  editorView: EditorView;
  macroProvider?: Promise<MacroProvider>;
  node: PMNode;
  extensionHandlers?: ExtensionHandlers;
  setExtensionElement: (
    element: HTMLElement | null,
  ) => (state: EditorState, dispatch: (tr: Transaction) => void) => void;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  selectExtension: (
    state: EditorState,
    dispatch: (tr: Transaction) => void,
  ) => void;
  isSelected: Boolean;
}

export interface State {
  macroProvider?: MacroProvider;
}

export default class ExtensionComponent extends Component<Props, State> {
  state: State = {};
  mounted = false;
  editorActions = new EditorActions();

  componentWillMount() {
    this.mounted = true;
    this.editorActions._privateRegisterEditor(this.props.editorView);
  }

  componentDidMount() {
    const { macroProvider } = this.props;
    if (macroProvider) {
      macroProvider.then(this.handleMacroProvider);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    const { macroProvider } = nextProps;

    if (this.props.macroProvider !== macroProvider) {
      if (macroProvider) {
        macroProvider.then(this.handleMacroProvider);
      } else {
        this.setState({ macroProvider });
      }
    }
  }

  render() {
    const { macroProvider } = this.state;
    const { node, handleContentDOMRef, isSelected, editorView } = this.props;

    try {
      const extensionContent = this.handleExtension();
      if (extensionContent && React.isValidElement(extensionContent)) {
        return React.cloneElement(extensionContent as any, {
          onClick: this.handleSelectExtension,
          isSelected,
          editorActions: this.editorActions,
          editorView,
        });
      }
    } catch (e) {
      console.log('error rendering extension', e);
      /** We don't want this error to block renderer */
      /** We keep rendering the default content */
    }

    switch (node.type.name) {
      case 'extension':
      case 'bodiedExtension':
        return (
          <Extension
            node={node}
            macroProvider={macroProvider}
            onClick={this.handleClick}
            handleContentDOMRef={handleContentDOMRef}
            onSelectExtension={this.handleSelectExtension}
          />
        );
      case 'inlineExtension':
        return (
          <InlineExtension
            node={node}
            macroProvider={macroProvider}
            onClick={this.handleClick}
          />
        );
      default:
        return null;
    }
  }

  private handleExtension = () => {
    const { node, extensionHandlers, editorView } = this.props;
    const { extensionKey, extensionType, parameters } = node.attrs;

    if (!extensionHandlers || !extensionHandlers[extensionType]) {
      return;
    }

    return extensionHandlers[extensionType](
      {
        extensionKey,
        type: node.type.name as any,
        parameters,
        content: node.content,
      },
      editorView.root,
    );
  };

  private handleMacroProvider = (macroProvider: MacroProvider) => {
    if (this.mounted) {
      this.setState({ macroProvider });
    }
  };

  private handleClick = (event: React.SyntheticEvent<any>) => {
    if (event.nativeEvent.defaultPrevented) {
      return;
    }
    event.nativeEvent.preventDefault();
    const { state, dispatch } = this.props.editorView;
    this.props.setExtensionElement(event.currentTarget)(state, dispatch);
  };

  private handleSelectExtension = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.selectExtension(state, dispatch);
  };
}
