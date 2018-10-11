import * as React from 'react';
import { ComponentType } from 'react';
import { ResultBase } from '../types/ResultBase';

export default function WithSelectedIcon<P>(
  icon: JSX.Element,
): (WrappedComponent: ComponentType<P & ResultBase>) => ComponentType<P> {
  return WrappedComponent => {
    return class WithSelectedIconComponent extends React.Component<
      P & ResultBase
    > {
      getElemAfter() {
        const { isSelected } = this.props;
        if (!isSelected) {
          return undefined;
        }
        return icon;
      }
      render() {
        return (
          <WrappedComponent {...this.props} elemAfter={this.getElemAfter()} />
        );
      }
    };
  };
}
