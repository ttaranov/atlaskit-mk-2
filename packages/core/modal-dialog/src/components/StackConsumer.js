// @flow
import React, { type Node } from 'react';

type Props = {
  children: number => Node,
};

type State = {
  stackIndex: number,
};

let stackConsumers = [];

class StackConsumer extends React.Component<Props, State> {
  componentWillUnmount() {
    stackConsumers
      .filter((updateFn, i) => i > stackConsumers.indexOf(this.update))
      .forEach(updateFn => updateFn());
    stackConsumers = stackConsumers.filter(stack => stack !== this.update);
  }
  componentDidMount() {
    stackConsumers.forEach(updateFn => updateFn());
  }
  update = () => {
    this.forceUpdate();
  };
  render() {
    if (stackConsumers.indexOf(this.update) === -1) {
      // add this instance to stack consumer list
      stackConsumers = [this.update, ...stackConsumers];
    }
    return this.props.children(stackConsumers.indexOf(this.update));
  }
}

export default StackConsumer;
