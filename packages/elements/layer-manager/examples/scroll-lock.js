// @flow
import React, { Component } from 'react';
import { ScrollLock } from '../src';

type Props = {};
type State = { isActive: boolean };

export default class ScrollLockExample extends Component<Props, State> {
  state: State = { isActive: false };
  toggleLock = () => this.setState(state => ({ isActive: !state.isActive }));
  render() {
    const { isActive } = this.state;
    const id = 'scroll-lock-example-checkbox';

    return (
      <div>
        Disable scroll on the body:{' '}
        <label htmlFor={id}>
          <input
            id={id}
            type="checkbox"
            onChange={this.toggleLock}
            checked={isActive}
          />
          {isActive ? 'Locked' : 'Unlocked'}
        </label>
        {isActive ? <ScrollLock /> : null}
      </div>
    );
  }
}
