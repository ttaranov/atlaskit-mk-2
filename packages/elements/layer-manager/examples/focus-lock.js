// @flow
import React, { Component } from 'react';
import { FocusLock } from '@atlaskit/layer-manager';
import UnlockIcon from '@atlaskit/icon/glyph/unlock';
import LockIcon from '@atlaskit/icon/glyph/lock';

type Props = {};
type State = { isActive: boolean };

export default class FocusLockExample extends Component<Props, State> {
  target: HTMLElement;
  state: State = { isActive: false };
  toggleLock = () => {
    this.setState(
      state => ({ isActive: !state.isActive }),
      () => {
        if (this.state.isActive) this.target.focus();
      },
    );
  };
  getTarget = (ref: HTMLElement) => {
    this.target = ref;
  };
  render() {
    const { isActive } = this.state;
    const boxStyle = {
      backgroundColor: isActive ? '#f6f6f6' : '#fafafa',
      // border: `2px solid ${isActive ? 'dodgerBlue' : '#fafafa'}`,
      borderRadius: 4,
      display: 'flex',
      marginTop: 8,
      padding: 8,
    };

    return (
      <div>
        <p>
          Lock focus to the div below:{' '}
          <button onClick={this.toggleLock}>
            {isActive ? 'Unlock' : 'Lock'}
          </button>
        </p>
        <FocusLock enabled={isActive}>
          <div style={boxStyle}>
            {isActive ? (
              <LockIcon label="Focus locked icon" />
            ) : (
              <UnlockIcon label="Focus unlocked icon" />
            )}
            <div style={{ paddingLeft: 8 }}>
              <p>
                Once a user moves focus to this element or one of its
                descendents they will not be able to tab outside of it.
              </p>
              <p>
                <button ref={this.getTarget}>Button 1</button>
                <button>Button 2</button>
                <button>Button 3</button>
              </p>
            </div>
          </div>
        </FocusLock>
      </div>
    );
  }
}
