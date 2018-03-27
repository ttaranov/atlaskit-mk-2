import * as React from 'react';
import { PureComponent } from 'react';
import { ReactRenderer as Renderer } from '@atlaskit/renderer';

import TaskList from '../src/components/TaskList';
import TaskItem from '../src/components/TaskItem';
import {
  MessageContainer,
  dumpRef,
  action,
  document,
} from '../example-helpers/story-utils';

interface Props {
  render: (
    taskStates: Map<string, boolean>,
    onChangeListener: (taskId: string, done: boolean) => void,
  ) => JSX.Element;
}

interface State {
  tick: number;
}

class TaskStateManager extends PureComponent<Props, State> {
  private taskStates = new Map<string, boolean>();

  constructor(props) {
    super(props);
    this.state = {
      tick: 0,
    };
  }

  private onChangeListener = (taskId, done) => {
    action('onChange')();
    this.taskStates.set(taskId, done);
    this.setState({ tick: this.state.tick + 1 });
  };

  render() {
    return (
      <MessageContainer>
        {this.props.render(this.taskStates, this.onChangeListener)}
      </MessageContainer>
    );
  }
}

export default () => (
  <div>
    <h3>Simple TaskList</h3>
    <TaskStateManager
      render={(taskStates, onChangeListener) => (
        <TaskList>
          <TaskItem
            contentRef={dumpRef}
            taskId="task-1"
            onChange={onChangeListener}
            isDone={taskStates.get('task-1')}
          >
            Hello <b>world</b>.
          </TaskItem>
          <TaskItem
            contentRef={dumpRef}
            taskId="task-2"
            onChange={onChangeListener}
            isDone={taskStates.get('task-2')}
          >
            <Renderer document={document} />
          </TaskItem>
          <TaskItem
            contentRef={dumpRef}
            taskId="task-3"
            onChange={onChangeListener}
            isDone={taskStates.get('task-3')}
          >
            Hello <b>world</b>.
          </TaskItem>
          <TaskItem
            contentRef={dumpRef}
            taskId="task-4"
            onChange={onChangeListener}
            isDone={taskStates.get('task-4')}
          >
            <Renderer document={document} />
          </TaskItem>
        </TaskList>
      )}
    />
    <h3>Single item TaskList</h3>
    <TaskStateManager
      render={(taskStates, onChangeListener) => (
        <TaskList>
          <TaskItem
            contentRef={dumpRef}
            taskId="task-5"
            onChange={onChangeListener}
            isDone={taskStates.get('task-5')}
          >
            Hello <b>world</b>.
          </TaskItem>
        </TaskList>
      )}
    />

    <h3>Empty TaskList</h3>
    <MessageContainer>
      <TaskList />
    </MessageContainer>
  </div>
);
