import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { ResourcedTaskItem as AkTaskItem } from '@atlaskit/task-decision';
import TaskItem from '../../../../src/renderer/react/nodes/taskItem';

describe('Renderer - React/Nodes/TaskItem', () => {
  it('should wrap content with <AkTaskItem>-tag', () => {
    const taskItem = mount(<TaskItem localId="task-1">This is a task item</TaskItem>);
    expect(taskItem.find(AkTaskItem).length).toEqual(1);
    taskItem.unmount();
  });

  it('should not render if no children', () => {
    const taskItem = shallow(<TaskItem localId="task-2"/>);
    expect(taskItem.isEmptyRender()).toBe(true);
  });
});
