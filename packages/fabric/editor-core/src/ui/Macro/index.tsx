import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import {
  default as ProviderFactory,
  WithProviders
} from '../../providerFactory';
import MacroComponent from './MacroComponent';
import { setMacroElement } from '../../editor/plugins/macro/actions';

export interface Props {
  editorView: EditorView;
  node: PMNode;
  providerFactory?: ProviderFactory;
}

export default class Macro extends Component<Props, any> {
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

  private renderWithProvider = (providers) => {
    const { node, editorView } = this.props;
    const { macroProvider } = providers;

    return (
      <MacroComponent
        editorView={editorView}
        node={node}
        macroProvider={macroProvider}
        setMacroElement={setMacroElement}
      />
    );
  }

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
