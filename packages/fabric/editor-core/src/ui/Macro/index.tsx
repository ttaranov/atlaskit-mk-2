import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import {
  default as ProviderFactory,
  WithProviders
} from '../../providerFactory';
import MacroComponent from './MacroComponent';
import { setMacroElement } from '../../editor/plugins/macro/actions';

export interface Props {
  macroId: string;
  placeholderUrl: string;
  view: EditorView;
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
    const { macroId, placeholderUrl, view } = this.props;
    const { macroProvider } = providers;

    return (
      <MacroComponent
        macroId={macroId}
        placeholderUrl={placeholderUrl}
        macroProvider={macroProvider}
        view={view}
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
