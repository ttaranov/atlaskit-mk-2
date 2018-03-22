import * as React from 'react';
import { mount } from 'enzyme';
import { ResourcedTaskItem, TaskItem } from '@atlaskit/task-decision';
import { storyData as taskDecisionStoryData } from '@atlaskit/task-decision/dist/es5/support';
import { ProviderFactory } from '@atlaskit/editor-common';
import Task from '../../../../src/plugins/tasks-and-decisions/ui/Task';

const taskDecisionProvider = Promise.resolve(
  taskDecisionStoryData.getMockTaskDecisionResource(),
);
const contextIdentifierProvider = Promise.resolve({
  objectId: 'abc',
  containerId: 'def',
});

describe('@atlaskit/editor-core/ui/Task', () => {
  let providerFactory;

  beforeEach(() => {
    providerFactory = new ProviderFactory();
  });

  afterEach(() => {
    providerFactory.destroy();
  });

  it('should render resourced task item', () => {
    const task = mount(<Task taskId="abcd-abcd-abcd" isDone />);
    const resourcedTask = task.find(ResourcedTaskItem);

    expect(resourcedTask.prop('taskId')).toEqual('abcd-abcd-abcd');
    expect(resourcedTask.prop('isDone')).toEqual(true);
    task.unmount();
  });

  it('should pass TaskDecisionProvider into resourced task item', () => {
    providerFactory.setProvider('taskDecisionProvider', taskDecisionProvider);

    const task = mount(
      <Task taskId="abcd-abcd-abcd" isDone providers={providerFactory} />,
    );
    const resourcedTaskItem = task.find(ResourcedTaskItem);

    expect(resourcedTaskItem.prop('taskDecisionProvider')).toEqual(
      taskDecisionProvider,
    );
    task.unmount();
  });

  it('should pass ContextIdentifierProvider into resourced task item', async () => {
    providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );
    const task = mount(
      <Task taskId="abcd-abcd-abcd" isDone providers={providerFactory} />,
    );

    await contextIdentifierProvider;
    task.update();
    const resourcedTaskItem = task.find(ResourcedTaskItem);
    expect(resourcedTaskItem.prop('objectAri')).toEqual('abc');
    expect(resourcedTaskItem.prop('containerAri')).toEqual('def');
    task.unmount();
  });

  it('should change state of task if onChange is triggered and all providers are passed in', async () => {
    providerFactory.setProvider('taskDecisionProvider', taskDecisionProvider);
    providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );
    const task = mount(
      <Task taskId="abcd-abcd-abcd" isDone providers={providerFactory} />,
    );

    await contextIdentifierProvider;
    task
      .find(TaskItem)
      .find('input')
      .simulate('change');
    expect(task.find(TaskItem).prop('isDone')).toBe(false);
    task.unmount();
  });

  it('should not change state of task if no taskDecisionProvider', () => {
    providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );
    const task = mount(
      <Task taskId="abcd-abcd-abcd" isDone providers={providerFactory} />,
    );

    const taskItem = task.find(TaskItem);
    taskItem.find('input').simulate('change');
    expect(taskItem.prop('isDone')).toBe(true);
  });

  it('should not change state of task if no contextIdentifierProvider', () => {
    providerFactory.setProvider('taskDecisionProvider', taskDecisionProvider);
    const task = mount(
      <Task taskId="abcd-abcd-abcd" isDone providers={providerFactory} />,
    );

    const taskItem = task.find(TaskItem);
    taskItem.find('input').simulate('change');
    expect(taskItem.prop('isDone')).toBe(true);
    task.unmount();
  });
});
