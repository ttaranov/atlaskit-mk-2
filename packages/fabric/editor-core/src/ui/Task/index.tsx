import * as React from 'react';
import { PureComponent, ReactElement } from 'react';
import {
  default as ProviderFactory,
  WithProviders,
} from '../../providerFactory';
import TaskItemWithProviders from './task-item-with-providers';

export interface TaskProps {
  taskId: string;
  isDone: boolean;
  contentRef?: (node: HTMLElement | undefined) => void;
  onChange?: (taskId: string, isChecked: boolean) => void;
  showPlaceholder?: boolean;
  children?: ReactElement<any>;
  providers?: ProviderFactory;
}

export default class TaskItem extends PureComponent<TaskProps, {}> {
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

  private renderWithProvider = providerFactory => {
    const { providers, ...otherProps } = this.props;
    const { taskDecisionProvider, contextIdentifierProvider } = providerFactory;

    return (
      <TaskItemWithProviders
        {...otherProps}
        taskDecisionProvider={taskDecisionProvider}
        contextIdentifierProvider={contextIdentifierProvider}
      />
    );
  };

  render() {
    return (
      <WithProviders
        providers={['taskDecisionProvider', 'contextIdentifierProvider']}
        providerFactory={this.providerFactory}
        renderNode={this.renderWithProvider}
      />
    );
  }
}
