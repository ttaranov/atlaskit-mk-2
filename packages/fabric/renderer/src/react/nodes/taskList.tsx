import * as React from 'react';
import { PureComponent, Children } from 'react';

import { TaskList as AkTaskList, TaskItem } from '@atlaskit/task-decision';

export interface Props {
  children?: TaskItem | TaskItem[]
}

export default class TaskList extends PureComponent<Props, {}> {
  render() {
    const { children } = this.props;

    if (Children.count(children) === 0) {
      return null;
    }

    return (
      <div className="akTaskList"><AkTaskList>{children}</AkTaskList></div>
    );
  }
}
