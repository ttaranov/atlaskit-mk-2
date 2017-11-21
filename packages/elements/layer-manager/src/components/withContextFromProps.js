// @flow
import React, { Component, type Node, type ComponentType } from 'react';

type Props = { children: Node };

const DefaultBaseComponent = props => <div {...props} />;

const withContextFromProps = (
  propTypes: {},
  BaseComponent: ComponentType<*> = DefaultBaseComponent,
) => {
  class ContextProps extends Component<Props> {
    getChildContext() {
      const props = Object.keys(this.props).reduce((result, key) => {
        // eslint-disable-next-line no-param-reassign
        if (key !== 'children') result[key] = this.props[key];

        return result;
      }, {});

      return props;
    }

    render() {
      return <BaseComponent>{this.props.children}</BaseComponent>;
    }
  }

  ContextProps.displayName = 'withContextFromProps';
  ContextProps.childContextTypes = propTypes;

  return ContextProps;
};

export default withContextFromProps;
