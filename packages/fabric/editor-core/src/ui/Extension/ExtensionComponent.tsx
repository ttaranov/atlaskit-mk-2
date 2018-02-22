import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { MacroProvider } from '../../editor/plugins/macro';
import InlineExtension from './InlineExtension';
import Extension from './Extension';
import { ExtensionHandlers } from '../../editor/types';
import { pluginKey } from '../../editor/plugins/extension/plugin';
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
  element: HTMLElement | null;
}

export interface State {
  macroProvider?: MacroProvider;
  handlerResult?: any;
}

export default class ExtensionComponent extends Component<Props, State> {
  state: State = {
    handlerResult: null,
  };
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

    this.tryExtensionHandler(this.props);
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

    this.tryExtensionHandler(nextProps);
  }

  render() {
    const { macroProvider, handlerResult } = this.state;
    const { node, handleContentDOMRef } = this.props;

    if (handlerResult) {
      return handlerResult;
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

  private tryExtensionHandler(props) {
    const { node, isSelected, editorView, element } = props;

    const { dispatch } = editorView;

    const handlerResult = this.getExtensionHandlerResult(
      node,
      element,
      editorView,
      isSelected,
    );

    this.setState({ handlerResult });

    try {
      const meta = pluginKey.getState(editorView.state);

      // disable default toolbar - extension handler should provide it
      if (handlerResult && !meta.disableToolbar) {
        const tr = editorView.state.tr.setMeta(pluginKey, {
          disableToolbar: true,
        });
        dispatch(tr);
      }

      // enable default toolbar
      if (!handlerResult && meta.disableToolbar) {
        const tr = editorView.state.tr.setMeta(pluginKey, {
          disableToolbar: false,
        });
        dispatch(tr);
      }
    } catch (e) {
      // first time is throwing an error (Invalid position 1) from HyperlinkState
      console.log('error setting meta', e);
    }
  }

  private getExtensionHandlerResult(node, element, editorView, isSelected) {
    try {
      const extensionContent = this.handleExtension(node);
      if (extensionContent && React.isValidElement(extensionContent)) {
        return React.cloneElement(extensionContent as any, {
          onClick: this.handleClick,
          onSelect: this.handleSelectExtension,
          isSelected,
          editorActions: this.editorActions,
          editorView,
          element,
        });
      }
    } catch (e) {
      console.log('error rendering extension', e);
      /** We don't want this error to block renderer */
      /** We keep rendering the default content */
    }

    return null;
  }

  private handleExtension = node => {
    const { extensionHandlers, editorView } = this.props;
    const { extensionType } = node.attrs;

    if (!extensionHandlers || !extensionHandlers[extensionType]) {
      return;
    }

    return extensionHandlers[extensionType](node.attrs, editorView.root);
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
