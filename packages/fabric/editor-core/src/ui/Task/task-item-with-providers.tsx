import * as React from 'react';
import { PureComponent, ReactElement } from 'react';

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
  contextIdentifierProvider?: Promise<any>;
}

export interface State {
  resolvedContextProvider?: any;
}

export default class TaskItemWithProviders extends PureComponent<Props, State> {
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

  private updateContextIdentifierProvider(props: Props) {
    if (props.contextIdentifierProvider) {
      props.contextIdentifierProvider.then(resolvedContextProvider =>
        this.setState({ resolvedContextProvider }),
      );
    } else {
      this.setState({ resolvedContextProvider: undefined });
    }
  }

  render() {
    const {
      taskDecisionProvider,
      contextIdentifierProvider,
      ...otherProps,
    } = this.props;

    return <ResourcedTaskItem {...otherProps} />;
  }
}
