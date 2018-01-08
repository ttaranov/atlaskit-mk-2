// @flow
import React, { Component, type Node, type ComponentType } from 'react';

type Props = { children: Node };

const DefaultBaseComponent = props => <div {...props} />;

const withContextFromProps = (
  propTypes: {},
  BaseComponent: ComponentType<*> | null = DefaultBaseComponent,
) => {
  class ContextProps extends Component<Props> {
    getChildContext() {
      const props = Object.keys(propTypes).reduce((result, key) => {
        // eslint-disable-next-line no-param-reassign
        if (key !== 'children') result[key] = this.props[key];

        return result;
      }, {});

      return props;
    }

    render() {
      const { children, ...props } = this.props;
      return BaseComponent !== null ? (
        <BaseComponent>{this.props.children}</BaseComponent>
      ) : (
        // Hacky fix to work with TransitionGroup in withRenderTarget
        React.Children.only(React.cloneElement(children, props))
      );
    }
  }

  ContextProps.displayName = 'withContextFromProps';
  ContextProps.childContextTypes = propTypes;

  return ContextProps;
};

export default withContextFromProps;
