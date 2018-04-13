import * as React from 'react';
import { Component } from 'react';

export type NavigationDirection = 'prev' | 'next';

export interface NavigationProps {
  items: FileIdentifier[];
  currentItem: FileIdentifier;
  onChange: (direction: NavigationDirection) => void;
}

export class Navigation extends Component<NavigationProps, any> {
  render() {
    const { items, currentItem } = this.props;
    const isLeftVisible = items[0] !== currentItem;

    return (
      <div>
        {isLeftVisible ? (
          <div onClick={() => this.props.onChange('prev')}>prev</div>
        ) : null}
        <div onClick={() => this.props.onChange('next')}>next</div>
      </div>
    );
  }
}
