import * as React from 'react';
import { mount } from 'enzyme';
import { ResourcedTaskItem } from '@atlaskit/task-decision';
import Task from '../../src/ui/Task';

describe('@atlaskit/editor-core/ui/Task', () => {
  it('should render resourced task item', () => {
    const task = mount(<Task taskId="abcd-abcd-abcd" isDone={true} />);
    const resourcedTask = task.find(ResourcedTaskItem);

    expect(resourcedTask.prop('taskId')).toEqual('abcd-abcd-abcd');
    expect(resourcedTask.prop('isDone')).toEqual(true);
    task.unmount();
  });
});
