import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common';
import ExtensionComponent from './ExtensionComponent';
import {
  setExtensionElement,
  selectExtension,
} from '../../editor/plugins/extension/actions';
import { ExtensionHandlers } from '../../editor/types';

export interface Props {
  editorView: EditorView;
  node: PMNode;
  providerFactory?: ProviderFactory;
  handleContentDOMRef: (node: HTMLElement) => void;
  extensionHandlers?: ExtensionHandlers;
  isSelected: Boolean;
  element: HTMLElement | null;
}

export default class Extension extends Component<Props, any> {
  private providerFactory: ProviderFactory;

  constructor(props) {
    super(props);
    this.providerFactory = props.providerFactory || new ProviderFactory();
  }

  componentWillUnmount() {
    if (!this.props.providerFactory) {
      // new ProviderFactory is created if no `providers` has been set
      // in this case when component is unmounted it's safe to destroy this providerFactory
      this.providerFactory.destroy();
    }
  }

  private renderWithProvider = providers => {
    const {
      node,
      editorView,
      extensionHandlers,
      handleContentDOMRef,
      isSelected,
      element,
    } = this.props;
    const { macroProvider } = providers;

    return (
      <ExtensionComponent
        editorView={editorView}
        node={node}
        macroProvider={macroProvider}
        setExtensionElement={setExtensionElement}
        handleContentDOMRef={handleContentDOMRef}
        selectExtension={selectExtension}
        extensionHandlers={extensionHandlers}
        isSelected={isSelected}
        element={element}
      />
    );
  };

  render() {
    return (
      <WithProviders
        providers={['macroProvider']}
        providerFactory={this.providerFactory}
        renderNode={this.renderWithProvider}
      />
    );
  }
}
