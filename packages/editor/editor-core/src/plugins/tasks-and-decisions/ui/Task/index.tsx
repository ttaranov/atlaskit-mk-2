import * as React from 'react';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';
import { PureComponent, ReactElement } from 'react';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common';
import TaskItemWithProviders from './task-item-with-providers';

const messages = defineMessages({
  placeholder: {
    id: 'fabric.editor.taskPlaceholder',
    defaultMessage: "Type your action, use '@' to assign to someone.",
    description:
      'Placeholder description for an empty action/task in the editor',
  },
});

export interface TaskProps {
  taskId: string;
  isDone: boolean;
  contentRef?: (node: HTMLElement | undefined) => void;
  onChange?: (taskId: string, isChecked: boolean) => void;
  showPlaceholder?: boolean;
  children?: ReactElement<any>;
  providers?: ProviderFactory;
  disabled?: boolean;
}

export class TaskItem extends PureComponent<TaskProps & InjectedIntlProps, {}> {
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
    const {
      providers,
      intl: { formatMessage },
      ...otherProps
    } = this.props;
    const { taskDecisionProvider, contextIdentifierProvider } = providerFactory;
    const placeholder = formatMessage(messages.placeholder);

    return (
      <TaskItemWithProviders
        {...otherProps}
        placeholder={placeholder}
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

export default injectIntl(TaskItem);
