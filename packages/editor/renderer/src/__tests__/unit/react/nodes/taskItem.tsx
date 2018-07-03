import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { ResourcedTaskItem as AkTaskItem } from '@atlaskit/task-decision';
import TaskItem from '../../../../react/nodes/taskItem';

describe('Renderer - React/Nodes/TaskItem', () => {
  it('should wrap content with <AkTaskItem>-tag', () => {
    const text: any = 'This is a task item';
    const taskItem = mount(<TaskItem localId="task-1">{text}</TaskItem>);
    expect(taskItem.find(AkTaskItem).length).to.equal(1);
    taskItem.unmount();
  });

  it('should not render if no children', () => {
    const taskItem = shallow(<TaskItem localId="task-2" />);
    expect(taskItem.isEmptyRender()).to.equal(true);
  });
});
