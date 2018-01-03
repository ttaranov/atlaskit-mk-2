// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import InlineDialog from '../src';
import type { PositionType } from '../src/types';

type State = {
  dialogOpen: boolean,
  dialogPosition: PositionType,
};

export default class InlineDialogExample extends Component<{}, State> {
  state = {
    dialogOpen: true,
    dialogPosition: 'right top',
  };

  toggleDialog = () => this.setState({ dialogOpen: !this.state.dialogOpen });

  moveDialog = () => {
    const newPosition =
      this.state.dialogPosition === 'right top' ? 'left top' : 'right top';
    this.setState({ dialogPosition: newPosition });
  };
  render() {
    const styles = {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      height: '120px',
    };

    return (
      <div style={styles}>
        <div>
          <InlineDialog
            content={
              <div>
                <p>This dialog will shift sides.</p>
                <p>It will cover up part of the paragraph below.</p>
              </div>
            }
            isOpen={this.state.dialogOpen}
            position={this.state.dialogPosition}
            onContentClick={e => console.log('click happened', e)}
            onContentFocus={e => console.log('focus happened', e)}
            onContentBlur={e => console.log('blur happened', e)}
            onClose={e => console.log('close happened', e)}
          >
            <Button onClick={this.moveDialog}>Toggle Dialog Location</Button>
          </InlineDialog>
        </div>
        <p>Content after the whole inline dialog, demonstrating how it wraps</p>
      </div>
    );
  }
}
