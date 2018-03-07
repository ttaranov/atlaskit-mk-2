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

    return (
      <ListWrapper>
        {React.Children.map(children, (child, idx) => (
          <li key={idx}>{child}</li>
        ))}
      </ListWrapper>
    );
  }
}
