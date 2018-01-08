import * as React from 'react';
import { Component } from 'react';

import Bricks from 'bricks.js';
import { BricksInstance, SizeDetail } from 'bricks.js';

export interface BricksLayoutProps {
  id: string;
  children: JSX.Element[];
  packed?: string;
  sizes?: SizeDetail[];
}

export interface BricksLayoutState {
  instance: BricksInstance;
}

export class BricksLayout extends Component<
  BricksLayoutProps,
  BricksLayoutState
> {
  static defaultProps = {
    packed: 'data-packed',
    sizes: [{ columns: 3, gutter: 10 }],
  };

  componentDidMount() {
    const {
      id,
      packed = 'data-packed',
      sizes = [{ columns: 3, gutter: 10 }],
    } = this.props;

    const instance = Bricks({
      container: `#${id}`,
      packed,
      sizes,
    });

    instance.resize(true);
    this.setState({ instance });
  }

  componentDidUpdate({ children: prevChildren }: BricksLayoutProps) {
    const { children } = this.props;

    const { instance } = this.state;
    if (prevChildren.length === 0 && children.length === 0) {
      return;
    }

    return instance.pack();
  }

  componentWillUnmount() {
    this.state.instance.resize(false);
  }

  render() {
    const { id, children } = this.props;
    return (
      <div id={id} style={{ width: '200px' }}>
        {children}
      </div>
    );
  }
}
