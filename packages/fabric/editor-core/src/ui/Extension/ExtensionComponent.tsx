import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { MacroProvider } from '../../editor/plugins/macro';
import InlineExtension from './InlineExtension';
import Extension from './Extension';

export interface Props {
  editorView: EditorView;
  macroProvider?: Promise<MacroProvider>;
  node: PMNode;
  setExtensionElement: (
    element: HTMLElement | null,
  ) => (state: EditorState, dispatch: (tr: Transaction) => void) => void;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  selectExtension: (
    state: EditorState,
    dispatch: (tr: Transaction) => void,
  ) => void;
}

export interface State {
  macroProvider?: MacroProvider;
}

export default class ExtensionComponent extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
    const { macroProvider } = this.props;
    if (macroProvider) {
      macroProvider.then(this.handleMacroProvider);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
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
    const { node, handleContentDOMRef } = this.props;

    switch (node.type.name) {
      case 'extension':
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

  private handleMacroProvider = (macroProvider: MacroProvider) => {
    this.setState({ macroProvider });
  };

  private handleClick = (event: React.SyntheticEvent<any>) => {
    if (event.nativeEvent.defaultPrevented) {
      return;
    }
    event.nativeEvent.preventDefault();
    const { state, dispatch } = this.props.editorView;
    this.props.setExtensionElement(event.currentTarget)(state, dispatch);
  };

  private handleDocumentClick = (event: MouseEvent) => {
    if (event.defaultPrevented) {
      return;
    }
    const { state, dispatch } = this.props.editorView;
    this.props.setExtensionElement(null)(state, dispatch);
  };

  private handleSelectExtension = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.selectExtension(state, dispatch);
  };
}
