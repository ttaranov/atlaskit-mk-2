import * as React from 'react';
import { PureComponent, Children, ReactNode } from 'react';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common';
import TaskItemWithProviders from './task-item-with-providers';
import { RendererContext } from '../';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

export interface Props {
  localId: string;
  rendererContext?: RendererContext;
  state?: string;
  providers?: ProviderFactory;
  children?: ReactNode;
}

export default class TaskItem extends PureComponent<Props, {}> {
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
    const { children, localId, state, rendererContext } = this.props;
    let objectAri = '';
    let containerAri = '';
    if (rendererContext) {
      objectAri = rendererContext.objectAri || '';
      containerAri = rendererContext.containerAri || '';
    }

    return (
      <FabricElementsAnalyticsContext
        data={{
          userContext: 'document',
        }}
      >
        <TaskItemWithProviders
          objectAri={objectAri}
          containerAri={containerAri}
          taskId={localId}
          isDone={state === 'DONE'}
          taskDecisionProvider={taskDecisionProvider}
          contextIdentifierProvider={contextIdentifierProvider}
        >
          {children}
        </TaskItemWithProviders>
      </FabricElementsAnalyticsContext>
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
