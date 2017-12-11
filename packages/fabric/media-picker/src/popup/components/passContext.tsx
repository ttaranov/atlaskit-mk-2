import { Component } from 'react';

export default class PassContext extends Component<any, any> {
  // We need to manually specify all the child contexts
  static childContextTypes = {
    store() {},
  };

  getChildContext() {
    const { store } = this.props;

    return {
      store,
    };
  }

  render() {
    const { children } = this.props;

    return children;
  }
}
