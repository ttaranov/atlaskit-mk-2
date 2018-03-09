import * as React from 'react';
import { Wrapper } from './styled';

export interface LazyContentProps {
  placeholder?: JSX.Element;
  children?: React.ReactNode;
}

export interface LazyContentState {}

export class LazyContent extends React.Component<
  LazyContentProps,
  LazyContentState
> {
  render() {
    const { children, placeholder } = this.props;
    return (
      <Wrapper offset={100} placeholder={placeholder} content={children} />
    );
  }
}
