// @flow

import React, { Component, type Node } from 'react';
import { ThemeProvider } from 'styled-components';
import Lorem from 'react-lorem-component';

import ModalDialog, { ModalTransition } from '../src';

function onClose() {
  console.log('the "onClose" handler is fired');
}
const onClick = () => {};

type Props = {
  children: Node,
  footer: Function,
  header: Function,
  heading: string,
};

export default class ModalDemo extends Component<Props, {}> {
  static defaultProps = {
    heading: 'New issue',
  };

  render() {
    const { children, footer, header, heading } = this.props;

    return (
      <ThemeProvider theme={{}}>
        <ModalTransition>
          <ModalDialog
            actions={!footer ? [{ text: 'Create issue', onClick }] : undefined}
            footer={footer}
            header={header}
            onClose={onClose}
            heading={heading}
            {...this.props}
          >
            {children || <Lorem count="1" />}
          </ModalDialog>
        </ModalTransition>
      </ThemeProvider>
    );
  }
}
