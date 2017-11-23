import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { MacroProvider } from '../../editor/plugins/macro/types';
import { getPlaceholderUrl, getMacroId } from '@atlaskit/editor-common';
import InlineMacro from './InlineMacro';

export interface Props {
  editorView: EditorView;
  macroProvider?: Promise<MacroProvider>;
  node: PMNode;
  setMacroElement: (
    macroElement: HTMLElement | null,
  ) => (state: EditorState, dispatch: (tr: Transaction) => void) => void;
}

export interface State {
  macroProvider?: MacroProvider;
}

export default class MacroComponent extends Component<Props, State> {
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
    const { node } = this.props;

    if (!macroProvider) {
      return null;
    }

    if (node.type.name === 'inlineExtension') {
      return (
        <InlineMacro
          node={node}
          macroProvider={macroProvider}
          onClick={this.handleClick}
          getPlaceholderUrl={getPlaceholderUrl}
          getMacroId={getMacroId}
        />
      );
    }

    return null;
  }

  private handleMacroProvider = (macroProvider: MacroProvider) => {
    this.setState({ macroProvider });
  };

  private handleClick = (event: React.SyntheticEvent<any>) => {
    event.nativeEvent.stopImmediatePropagation();
    const { state, dispatch } = this.props.editorView;
    this.props.setMacroElement(event.currentTarget)(state, dispatch);
  };

  private handleDocumentClick = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.setMacroElement(null)(state, dispatch);
  };
}
