import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common';
import { setExtensionElement, selectExtension } from '../../actions';
import ExtensionComponent from './ExtensionComponent';

export interface Props {
  editorView: EditorView;
  node: PMNode;
  providerFactory?: ProviderFactory;
  handleContentDOMRef: (node: HTMLElement) => void;
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
    const { node, editorView, handleContentDOMRef } = this.props;
    const { macroProvider } = providers;

    return (
      <ExtensionComponent
        editorView={editorView}
        node={node}
        macroProvider={macroProvider}
        setExtensionElement={setExtensionElement}
        handleContentDOMRef={handleContentDOMRef}
        selectExtension={selectExtension}
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
