import * as React from 'react';
import { PureComponent, ComponentClass } from 'react';
import { EventDispatcher } from '../event-dispatcher';

export interface ConnectProps {
  [key: string]: any;
}

export default (
  WrappedComponent: ComponentClass<any>,
  eventDispatcher: EventDispatcher,
) =>
  class Connect extends PureComponent<ConnectProps, {}> {
    componentDidMount() {
      eventDispatcher.on('change', this.onChangeHandler);
    }

    componentWillUnmount() {
      eventDispatcher.off('change', this.onChangeHandler);
    }

    /**
     * TODO: It can mess things up if the WrappedComponent has static property,
     * can be improved using `hoist-non-react-statics`
     */
    render() {
      return React.createElement(WrappedComponent, {
        ...this.props,
        ...this.state,
      });
    }

    private onChangeHandler = nextState => {
      this.setState(nextState);
    };
  };
