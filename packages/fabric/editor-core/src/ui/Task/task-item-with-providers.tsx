import * as React from 'react';
import { Component, ReactElement } from 'react';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';
import {
  ContentRef,
  TaskDecisionProvider,
  ResourcedTaskItem,
} from '@atlaskit/task-decision';

export interface Props {
  taskId: string;
  isDone: boolean;
  contentRef?: ContentRef;
  onChange?: (taskId: string, isChecked: boolean) => void;
  showPlaceholder?: boolean;
  children?: ReactElement<any>;
  taskDecisionProvider?: Promise<TaskDecisionProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
}

export interface State {
  resolvedContextProvider?: ContextIdentifierProvider;
}

export default class TaskItemWithProviders extends Component<Props, State> {
  state: State = { resolvedContextProvider: undefined };

  componentWillMount() {
    this.updateContextIdentifierProvider(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.contextIdentifierProvider !==
      this.props.contextIdentifierProvider
    ) {
      this.updateContextIdentifierProvider(nextProps);
    }
  }

  private async updateContextIdentifierProvider(props: Props) {
    if (props.contextIdentifierProvider) {
      try {
        const resolvedContextProvider = await props.contextIdentifierProvider;
        this.setState({ resolvedContextProvider });
      } catch (err) {
        this.setState({ resolvedContextProvider: undefined });
      }
    } else {
      this.setState({ resolvedContextProvider: undefined });
    }
  }

  render() {
    const {
      taskDecisionProvider,
      contextIdentifierProvider,
      ...otherProps
    } = this.props;
    const { objectId, containerId } =
      this.state.resolvedContextProvider || ({} as ContextIdentifierProvider);

    return (
      <ResourcedTaskItem
        {...otherProps}
        taskDecisionProvider={taskDecisionProvider}
        objectAri={objectId}
        containerAri={containerId}
      />
    );
  }
}
