import * as React from 'react';
import { PureComponent } from 'react';
import ListWrapper from '../styled/ListWrapper';

export interface Props {
  children?: Array<JSX.Element> | JSX.Element;
}

export default class TaskList extends PureComponent<Props, {}> {
  render() {
    const { children } = this.props;

    if (!children) {
      return null;
    }

    // Data attributes are required for copy and paste from rendered content
    // to preserve the task
    return (
      <ListWrapper data-task-list-local-id="">
        {React.Children.map(children, (child, idx) => (
          <li key={idx} data-task-local-id="">
            {child}
          </li>
        ))}
      </ListWrapper>
    );
  }
}
