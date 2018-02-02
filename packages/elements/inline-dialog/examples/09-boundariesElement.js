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
  };

  toggleDialog = () => this.setState({ dialogOpen: !this.state.dialogOpen });

  render() {
    const styles = {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      height: '120px',
    };

    return (
      <div style={styles}>
        <div>
          <p>
            This is some random long long long long long long long long long
            long long long long long long text{' '}
          </p>
        </div>
        <div>
          <InlineDialog
            content={
              <div>
                <p>The content is too long and should be fliped to the left</p>
              </div>
            }
            boundariesElement="scrollParent"
            shouldFlip
            isOpen={this.state.dialogOpen}
            onContentClick={e => console.log('click happened', e)}
            onContentFocus={e => console.log('focus happened', e)}
            onContentBlur={e => console.log('blur happened', e)}
            onClose={e => console.log('close happened', e)}
          >
            <Button>target</Button>
          </InlineDialog>
        </div>
      </div>
    );
  }
}
