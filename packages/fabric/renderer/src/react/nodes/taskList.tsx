import * as React from 'react';
import { PureComponent, Children } from 'react';

import { TaskList as AkTaskList } from '@atlaskit/task-decision';

export default class TaskList extends PureComponent<{}, {}> {
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
