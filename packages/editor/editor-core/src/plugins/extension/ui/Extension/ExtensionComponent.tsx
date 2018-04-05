import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { selectParentNodeOfType } from 'prosemirror-utils';
import { ExtensionProvider } from '../../../macro';
import InlineExtension from './InlineExtension';
import Extension from './Extension';
import { ExtensionHandlers } from '@atlaskit/editor-common';

export interface Props {
  editorView: EditorView;
  extensionProvider?: Promise<ExtensionProvider>;
  node: PMNode;
  setExtensionElement: (
    element: HTMLElement | null,
  ) => (state: EditorState, dispatch: (tr: Transaction) => void) => void;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  extensionHandlers: ExtensionHandlers;
}

export interface State {
  extensionProvider?: ExtensionProvider;
}

export default class ExtensionComponent extends Component<Props, State> {
  state: State = {};
  mounted = false;

  componentWillMount() {
    this.mounted = true;
  }

  componentDidMount() {
    const { extensionProvider } = this.props;
    if (extensionProvider) {
      extensionProvider.then(this.handleExtensionProvider);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    const { extensionProvider } = nextProps;

    if (this.props.extensionProvider !== extensionProvider) {
      if (extensionProvider) {
        extensionProvider.then(this.handleExtensionProvider);
      } else {
        this.setState({ extensionProvider });
      }
    }
  }

  render() {
    const { extensionProvider } = this.state;
    const { node, handleContentDOMRef } = this.props;
    const extensionHandlerResult = this.tryExtensionHandler();

    switch (node.type.name) {
      case 'extension':
      case 'bodiedExtension':
        return (
          <Extension
            node={node}
            extensionProvider={extensionProvider}
            onClick={this.handleClick}
            handleContentDOMRef={handleContentDOMRef}
            onSelectExtension={this.handleSelectExtension}
          >
            {extensionHandlerResult}
          </Extension>
        );
      case 'inlineExtension':
        return (
          <InlineExtension
            node={node}
            extensionProvider={extensionProvider}
            onClick={this.handleClick}
          >
            {extensionHandlerResult}
          </InlineExtension>
        );
      default:
        return null;
    }
  }

  private handleExtensionProvider = (extensionProvider: ExtensionProvider) => {
    if (this.mounted) {
      this.setState({ extensionProvider });
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
    dispatch(
      selectParentNodeOfType(state.schema.nodes.bodiedExtension)(state.tr),
    );
  };

  private tryExtensionHandler() {
    const { node } = this.props;
    try {
      const extensionContent = this.handleExtension(node);
      if (extensionContent && React.isValidElement(extensionContent)) {
        return extensionContent;
      }
    } catch (e) {
      /* tslint:disable-next-line:no-console */
      console.error('Provided extension handler has thrown an error\n', e);
      /** We don't want this error to block renderer */
      /** We keep rendering the default content */
    }
    return null;
  }

  private handleExtension = (node: PMNode) => {
    const { extensionHandlers, editorView } = this.props;
    const { extensionType, extensionKey, parameters } = node.attrs;
    const isBodiedExtension = node.type.name === 'bodiedExtension';

    if (
      !extensionHandlers ||
      !extensionHandlers[extensionType] ||
      isBodiedExtension
    ) {
      return;
    }

    return extensionHandlers[extensionType](
      {
        type: node.type.name as
          | 'extension'
          | 'inlineExtension'
          | 'bodiedExtension',
        extensionType,
        extensionKey,
        parameters,
        content: node.content,
      },
      editorView.state.doc,
    );
  };
}
