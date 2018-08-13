// @flow
import React, { Component } from 'react';
import Lorem from 'react-lorem-component';
import InlineDialog from '../src';

type State = {
  dialogOpen: boolean,
};

const content = (
  <div>
    <p>Hello!</p>
  </div>
);

export default class InlineDialogExample extends Component<{}, State> {
  render() {
    return (
      <div
        style={{
          maxWidth: '300px',
          maxHeight: '120px',
          overflowY: 'auto',
          border: '2px dashed grey',
        }}
      >
        <Lorem count={2} />
        <p>
          Some more text and an{' '}
          <InlineDialog content={content} isOpen>
            <span>inline-dialog</span>
          </InlineDialog>
          to show that the dialog is not clipped by the scroll parent.
        </p>
        <Lorem count={6} />
      </div>
    );
  }
}
