import * as React from 'react';
import { PureComponent, Children, ReactNode } from 'react';

import { TaskList as AkTaskList } from '@atlaskit/task-decision';

export interface Props {
  localId?: string;
  children?: ReactNode;
}

export default class TaskList extends PureComponent<Props, {}> {
  render() {
    const { children, localId } = this.props;

    if (Children.count(children) === 0) {
      return null;
    }

    return (
      <div className="akTaskList">
        <AkTaskList listId={localId}>{children}</AkTaskList>
      </div>
    );
  }
}
