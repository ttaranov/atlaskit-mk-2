import * as React from 'react';
import { PureComponent, Children } from 'react';
import { ResourcedTaskItem as AkTaskItem } from '@atlaskit/task-decision';
import { RendererContext } from '../';
import {
  ProviderFactory,
  WithProviders
} from '@atlaskit/editor-common';
export interface Props {
  localId: string;
  state?: string;
  rendererContext?: RendererContext;
  providers?: ProviderFactory;
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

  private renderWithProvider = (providers) => {
    const { taskDecisionProvider } = providers;
    const { children, localId, state, rendererContext } = this.props;
    const { objectAri, containerAri } = rendererContext || { objectAri: '', containerAri: '' };

    return (
      <AkTaskItem taskId={localId} isDone={state === 'DONE'} objectAri={objectAri} containerAri={containerAri} taskDecisionProvider={taskDecisionProvider}>
        {children}
      </AkTaskItem>
    );
  }

  render() {
    const { children } = this.props;

    if (Children.count(children) === 0) {
      return null;
    }

    return (
      <WithProviders
        providers={['taskDecisionProvider']}
        providerFactory={this.providerFactory}
        renderNode={this.renderWithProvider}
      />
    );
  }
}
