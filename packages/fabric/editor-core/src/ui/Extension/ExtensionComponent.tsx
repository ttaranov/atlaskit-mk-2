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
    shouldDisableToolbar?: boolean,
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
    const { node, handleContentDOMRef } = this.props;

    const handlerResult = this.tryExtensionHandler();

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

  private tryExtensionHandler() {
    const { node, isSelected, element, handleContentDOMRef } = this.props;

    try {
      const extensionContent = this.handleExtension(node);
      /**
       * The extension handler should return a react component. This component will receive:
       * - onClick: handler to select a node
       * - onSelect: bodied macros selection handler
       * - editorActions: public api containing useful actions to interact with the document
       * - element: the node's DOM node
       * - handleContentDOMRef: used to identify the editable body of a bodied macro
       */
      if (extensionContent && React.isValidElement(extensionContent)) {
        return React.cloneElement(extensionContent as any, {
          onClick: this.handleClickForExtensionHandlers,
          onSelect: this.handleSelectExtension,
          isSelected,
          editorActions: this.editorActions,
          element,
          handleContentDOMRef,
        });
      }
    } catch (e) {
      console.log('error coming from the extension handler', e);
      /** We don't want this error to block renderer */
      /** We keep rendering the default content */
    }

    return null;
  }

  private handleExtension = node => {
    const { extensionHandlers, editorView } = this.props;
    const { extensionType, extensionKey, parameters } = node.attrs;

    if (!extensionHandlers || !extensionHandlers[extensionType]) {
      return;
    }

    return extensionHandlers[extensionType](
      {
        type: node.type.name,
        extensionType,
        extensionKey,
        parameters,
        content: node.content,
      },
      editorView.state.doc,
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

  private handleClickForExtensionHandlers = (
    event: React.SyntheticEvent<any>,
  ) => {
    if (event.nativeEvent.defaultPrevented) {
      return;
    }
    event.nativeEvent.preventDefault();
    const { state, dispatch } = this.props.editorView;
    this.props.setExtensionElement(event.currentTarget, true)(state, dispatch);
  };

  private handleSelectExtension = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.selectExtension(state, dispatch);
  };
}
