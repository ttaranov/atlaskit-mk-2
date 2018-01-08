// @flow
import React, {
  Component,
  type ComponentType,
  type ChildrenArray,
  type Element,
} from 'react';

type Props = { children: ChildrenArray<Element<*>> };

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
      if (BaseComponent !== null) {
        return <BaseComponent>{this.props.children}</BaseComponent>;
      } else if (React.Children.count(children) === 1) {
        const onlyChild = ((children: any): Element<*>);
        // Hacky fix to work with TransitionGroup in withRenderTarget
        return React.Children.only(React.cloneElement(onlyChild, props));
      }
      throw Error('Only one child should exist when base component is null');
    }
  }

  ContextProps.displayName = 'withContextFromProps';
  ContextProps.childContextTypes = propTypes;

  return ContextProps;
};

export default withContextFromProps;
