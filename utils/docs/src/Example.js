// @flow
import * as React from 'react';

type ExampleProps = {
  component: React.Node
};

export default class Example extends React.Component<ExampleProps> {
  render() {
    const {component} = this.props;

    return (
      <div>{component}</div>
    );
  }
}
