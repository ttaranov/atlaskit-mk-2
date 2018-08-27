import * as React from 'react';
import { mount } from 'enzyme';
import TaskList from '../../../components/TaskList';
import TaskItem from '../../../components/TaskItem';

describe('<TaskList/>', () => {
  it('should render all TaskItems', () => {
    const component = mount(
      <TaskList>
        <TaskItem taskId="task-1">1</TaskItem>
        <TaskItem taskId="task-2">2</TaskItem>
      </TaskList>,
    );
    expect(component.find('li').length).toEqual(2);
    expect(component.find(TaskItem).length).toEqual(2);
  });
  it('should render single TaskItem', () => {
    const component = mount(
      <TaskList>
        <TaskItem taskId="task-1">1</TaskItem>
      </TaskList>,
    );
    expect(component.find('li').length).toEqual(1);
    expect(component.find(TaskItem).length).toEqual(1);
  });
  it("shouldn't render list when no items", () => {
    const component = mount(<TaskList />);
    expect(component.find('ol').length).toEqual(0);
    expect(component.find('li').length).toEqual(0);
    expect(component.find(TaskItem).length).toEqual(0);
  });
  it('should include data attributes on ol/li', () => {
    const component = mount(
      <TaskList>
        <TaskItem taskId="task-1">1</TaskItem>
      </TaskList>,
    );
    const ol = component.find('ol');
    expect(ol.length).toEqual(1);
    expect(ol.prop('data-task-list-local-id')).toEqual('');
    const li = component.find('li');
    expect(li.length).toEqual(1);
    expect(li.prop('data-task-local-id')).toEqual('');
  });
});
