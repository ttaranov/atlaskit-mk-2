import * as React from 'react';
import { PureComponent, Children, ReactElement } from 'react';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common';
import DecisionItemWithProviders from './decision-item-with-providers';
import { RendererContext } from '../';

export interface Props {
  localId: string;
  rendererContext?: RendererContext;
  providers?: ProviderFactory;
  children?: ReactElement<any>;
}

export default class DecisionItem extends PureComponent<Props, {}> {
  private providerFactory: ProviderFactory;

  constructor(props) {
    super(props);
    this.providerFactory = props.providers || new ProviderFactory();
  }

  componentWillUnmount() {
    if (!this.props.providers) {
      // new ProviderFactory is created if no `providers` has been set
      // in this case when component is unmounted it's safe to destroy this providerFactory
      this.providerFactory.destroy();
    }
  }

  private renderWithProvider = providers => {
    const { taskDecisionProvider, contextIdentifierProvider } = providers;
    const { children, localId, rendererContext } = this.props;
    let objectAri = '';
    let containerAri = '';
    if (rendererContext) {
      objectAri = rendererContext.objectAri || '';
      containerAri = rendererContext.containerAri || '';
    }

    return (
      <DecisionItemWithProviders
        objectAri={objectAri}
        containerAri={containerAri}
        localId={localId}
        taskDecisionProvider={taskDecisionProvider}
        contextIdentifierProvider={contextIdentifierProvider}
      >
        {children}
      </DecisionItemWithProviders>
    );
  };

  render() {
    const { children } = this.props;

    if (Children.count(children) === 0) {
      return null;
    }

    return (
      <WithProviders
        providers={['taskDecisionProvider', 'contextIdentifierProvider']}
        providerFactory={this.providerFactory}
        renderNode={this.renderWithProvider}
      />
    );
  }
}
