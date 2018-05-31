import { FireAnalyticsEvent, withAnalytics } from '@atlaskit/analytics';
import * as React from 'react';
import { PureComponent } from 'react';
import { CheckBoxWrapper } from '../styled/TaskItem';
import {
  Appearance,
  ContentRef,
  User,
  OnReminder,
  ReminderTime,
} from '../types';
import Item from './Item';
import { ParticipantsAdornment } from './ParticipantsAdornment';
import { ReminderAdornment } from './ReminderAdornment';

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
  disabled?: boolean;
  onReminderSet?: OnReminder;
  reminderDate?: ReminderTime;
}

let taskCount = 0;
const getCheckBoxId = (localId: string) => `${localId}-${taskCount++}`;

export class InternalTaskItem extends PureComponent<Props> {
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

  getHelperText() {
    const { creator, lastUpdater, isDone } = this.props;

    if (isDone && lastUpdater) {
      return `Completed by ${lastUpdater.displayName}`;
    }

    if (!creator || !creator.displayName) {
      return undefined;
    }

    return `Added by ${creator.displayName}`;
  }

  handleReminderSet = reminder => {
    if (this.props.onReminderSet) {
      this.props.onReminderSet(reminder);
    }
  };

  render() {
    const {
      appearance,
      isDone,
      contentRef,
      children,
      participants,
      showPlaceholder,
      disabled,
      reminderDate,
    } = this.props;

    const icon = (
      <CheckBoxWrapper contentEditable={false}>
        <input
          id={this.checkBoxId}
          name={this.checkBoxId}
          type="checkbox"
          onChange={this.handleOnChange}
          checked={!!isDone}
          disabled={!!disabled}
        />
        <label htmlFor={this.checkBoxId} />
      </CheckBoxWrapper>
    );

    const endAdornments = [
      <ReminderAdornment
        onReminderSet={this.handleReminderSet}
        value={reminderDate}
      />,
      <ParticipantsAdornment
        key="participant"
        appearance={appearance}
        participants={participants}
      />,
    ];

    return (
      <Item
        appearance={appearance}
        contentRef={contentRef}
        startAdornment={icon}
        endAdornment={endAdornments}
        placeholder={
          showPlaceholder
            ? "Type your action, use '@' to assign to someone."
            : undefined
        }
        helperText={this.getHelperText()}
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
