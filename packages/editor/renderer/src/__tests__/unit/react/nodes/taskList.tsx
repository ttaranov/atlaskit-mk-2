import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TaskList as AkTaskList } from '@atlaskit/task-decision';
import TaskList from '../../../../react/nodes/taskList';

describe('Renderer - React/Nodes/TaskList', () => {
  it('should wrap content with <AkTaskList>-tag with start prop', () => {
    const text: any = 'This is a task list';
    const taskListWrapper = shallow(<TaskList>{text}</TaskList>);
    const taskList = taskListWrapper.childAt(0);
    expect(taskListWrapper.is('div')).to.equal(true);
    expect(taskList.is(AkTaskList)).to.equal(true);
  });

  it('should not render if no children', () => {
    const taskList = shallow(<TaskList />);
    expect(taskList.isEmptyRender()).to.equal(true);
  });
});
