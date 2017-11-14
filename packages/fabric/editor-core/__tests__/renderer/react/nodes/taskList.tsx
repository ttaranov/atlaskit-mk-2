import * as React from 'react';
import { shallow } from 'enzyme';
import { TaskList as AkTaskList } from '@atlaskit/task-decision';
import TaskList from '../../../../src/renderer/react/nodes/taskList';

describe('Renderer - React/Nodes/TaskList', () => {
  it('should wrap content with <AkTaskList>-tag with start prop', () => {
    const taskListWrapper = shallow(<TaskList>This is a task list</TaskList>);
    const taskList = taskListWrapper.childAt(0);
    expect(taskListWrapper.is('div')).toBe(true);
    expect(taskList.is(AkTaskList)).toBe(true);
  });

  it('should not render if no children', () => {
    const taskList = shallow(<TaskList/>);
    expect(taskList.isEmptyRender()).toBe(true);
  });
});
