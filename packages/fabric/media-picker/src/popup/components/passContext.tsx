import * as React from 'react';
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

    return (
      // <div className="foo-ba" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none'}}>
      children
      // </div>
    );
  }
}
