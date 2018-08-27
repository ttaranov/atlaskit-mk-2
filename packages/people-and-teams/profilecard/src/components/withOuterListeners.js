// @flow
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

type Props = {
  handleClickOutside: Function,
  handleEscapeKeydown: Function,
};

export default function withOuterListeners(Component: any) {
  return class WithOutsideClick extends PureComponent<Props> {
    componentDidMount() {
      if (this.props.handleClickOutside) {
        document.addEventListener('click', this.handleClick, false);
      }

      if (this.props.handleEscapeKeydown) {
        document.addEventListener('keydown', this.handleKeydown, false);
      }
    }

    componentWillUnmount() {
      if (this.props.handleClickOutside) {
        document.removeEventListener('click', this.handleClick, false);
      }

      if (this.props.handleEscapeKeydown) {
        document.removeEventListener('keydown', this.handleKeydown, false);
      }
    }

    handleClick = (evt: any) => {
      const domNode = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

      if (
        !domNode ||
        (evt.target instanceof Node && !domNode.contains(evt.target))
      ) {
        this.props.handleClickOutside();
      }
    };

    handleKeydown = (evt: any) => {
      if (evt.code === 'Escape') {
        this.props.handleEscapeKeydown();
      }
    };

    render() {
      return <Component {...this.props} />;
    }
  };
}
