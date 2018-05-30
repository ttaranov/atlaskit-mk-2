import * as React from 'react';
import { Component } from 'react';
import { TaskDecisionProvider, ReminderTime, HandlerType } from '../types';

import DecisionItem, { Props as DecisionProps } from './DecisionItem';
import { baseItemFromDecisionProps } from '../type-helpers';

export interface Props extends DecisionProps {
  localId: string;
  objectAri?: string;
  containerAri?: string;
  taskDecisionProvider?: Promise<TaskDecisionProvider>;
}

export interface State {
  reminderDate?: ReminderTime;
}

export default class ResourcedDecisionItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      reminderDate: props.reminderDate,
    };
  }

  componentDidMount() {
    this.subscribe(
      this.props.taskDecisionProvider,
      this.props.containerAri,
      this.props.objectAri,
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.taskDecisionProvider !== this.props.taskDecisionProvider ||
      nextProps.containerAri !== this.props.containerAri ||
      nextProps.objectAri !== this.props.objectAri
    ) {
      this.unsubscribe();
      this.subscribe(
        nextProps.taskDecisionProvider,
        nextProps.containerAri,
        nextProps.objectAri,
      );
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  private subscribe(
    taskDecisionProvider?: Promise<TaskDecisionProvider>,
    containerAri?: string,
    objectAri?: string,
  ) {
    if (taskDecisionProvider && containerAri && objectAri) {
      taskDecisionProvider.then(provider => {
        const { localId } = this.props;
        const objectKey = { localId, objectAri, containerAri };
        provider.subscribe(objectKey, {
          callback: this.onReminderUpdate,
          type: HandlerType.REMINDER,
        });
      });
    }
  }

  private unsubscribe() {
    const {
      localId,
      taskDecisionProvider,
      objectAri,
      containerAri,
    } = this.props;
    if (taskDecisionProvider && containerAri && objectAri) {
      taskDecisionProvider.then(provider => {
        const objectKey = { localId, objectAri, containerAri };
        provider.unsubscribe(objectKey, {
          callback: this.onReminderUpdate,
          type: HandlerType.REMINDER,
        });
      });
    }
  }

  private onReminderUpdate = (timestamp?: ReminderTime) => {
    this.setState({ reminderDate: timestamp });
  };

  private onReminderSet = (reminderDate: ReminderTime) => {
    const { objectAri, containerAri, taskDecisionProvider } = this.props;
    if (taskDecisionProvider && containerAri && objectAri) {
      taskDecisionProvider.then(provider => {
        if (provider.updateReminderDate) {
          provider.updateReminderDate(
            baseItemFromDecisionProps(this.props),
            reminderDate,
          );
        }
      });
    }
  };

  render() {
    const {
      localId,
      objectAri,
      containerAri,
      taskDecisionProvider,
      ...props
    } = this.props;

    return (
      <DecisionItem
        {...props}
        onReminderSet={this.onReminderSet}
        reminderDate={this.state.reminderDate}
      />
    );
  }
}
