import * as React from 'react';
import { Component, ReactElement } from 'react';

import {
  ResourcedDecisionItem,
  TaskDecisionProvider,
} from '@atlaskit/task-decision';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';

export interface Props {
  localId: string;
  objectAri: string;
  containerAri: string;
  taskDecisionProvider?: Promise<TaskDecisionProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
  children?: ReactElement<any>;
}

export interface State {
  resolvedContextProvider?: ContextIdentifierProvider;
}

export default class DecisionItemWithProviders extends Component<Props, State> {
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
      contextIdentifierProvider,
      objectAri,
      containerAri,
      ...otherProps
    } = this.props;
    const { objectId, containerId } =
      this.state.resolvedContextProvider ||
      ({
        objectId: objectAri,
        containerId: containerAri,
      } as ContextIdentifierProvider);

    return (
      <ResourcedDecisionItem
        {...otherProps}
        objectAri={objectId}
        containerAri={containerId}
      />
    );
  }
}
