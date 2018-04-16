import * as React from 'react';
import { PureComponent } from 'react';

import { CheckBoxWrapper } from '../styled/TaskItem';

import Item from './Item';
import { Appearance, ContentRef, User } from '../types';
import { withAnalytics, FireAnalyticsEvent } from '@atlaskit/analytics';

export interface Props {
  taskId: string;
  isDone?: boolean;
  onChange?: (taskId: string, isChecked: boolean) => void;
  contentRef?: ContentRef;
  children?: any;
  showPlaceholder?: boolean;
  appearance?: Appearance;
  participants?: User[];
  showParticipants?: boolean;
  creator?: User;
  lastUpdater?: User;
  fireAnalyticsEvent?: FireAnalyticsEvent;
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
}

let taskCount = 0;
const getCheckBoxId = (localId: string) => `${localId}-${taskCount++}`;

export class InternalTaskItem extends PureComponent<Props, {}> {
  public static defaultProps: Partial<Props> = {
    appearance: 'inline',
  };

  private checkBoxId: string;

  constructor(props) {
    super(props);
    this.checkBoxId = getCheckBoxId(props.taskId);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.taskId !== this.props.taskId) {
      this.checkBoxId = getCheckBoxId(nextProps.taskId);
    }
  }

  handleOnChange = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const {
      onChange,
      taskId,
      isDone,
      fireAnalyticsEvent,
      firePrivateAnalyticsEvent,
    } = this.props;
    const newIsDone = !isDone;
    if (onChange) {
      onChange(taskId, newIsDone);
    }
    const suffix = newIsDone ? 'check' : 'uncheck';
    if (fireAnalyticsEvent) {
      fireAnalyticsEvent(suffix, {});
    }
    if (firePrivateAnalyticsEvent) {
      firePrivateAnalyticsEvent(`atlassian.fabric.action.${suffix}`, {});
    }
  };

  getAttributionText() {
    const { creator, lastUpdater, isDone } = this.props;

    if (isDone && lastUpdater) {
      return `Completed by ${lastUpdater.displayName}`;
    }

    if (!creator || !creator.displayName) {
      return undefined;
    }

    return `Added by ${creator.displayName}`;
  }

  render() {
    const {
      appearance,
      isDone,
      contentRef,
      children,
      participants,
      showPlaceholder,
    } = this.props;

    const icon = (
      <CheckBoxWrapper contentEditable={false}>
        <input
          id={this.checkBoxId}
          name={this.checkBoxId}
          type="checkbox"
          onChange={this.handleOnChange}
          checked={!!isDone}
        />
        <label htmlFor={this.checkBoxId} />
      </CheckBoxWrapper>
    );

    return (
      <Item
        appearance={appearance}
        contentRef={contentRef}
        icon={icon}
        participants={participants}
        placeholder="Type your action, use '@' to assign to someone."
        showPlaceholder={showPlaceholder}
        attribution={this.getAttributionText()}
      >
        {children}
      </Item>
    );
  }
}

// This is to ensure that the "type" is exported, as it gets lost and not exported along with TaskItem after
// going through the high order component.
// tslint:disable-next-line:variable-name
const TaskItem = withAnalytics<typeof InternalTaskItem>(
  InternalTaskItem,
  {},
  { analyticsId: 'atlassian.fabric.action' },
);
type TaskItem = InternalTaskItem;

export default TaskItem;
