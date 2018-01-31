// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Lorem from 'react-lorem-component';
import Button from '@atlaskit/button';
import Modal from '../src';

const TallContainer = styled.div`
  height: 2000px;
`;

const Paragraph = styled.p`
  padding-bottom: 200px;
`;

type State = {
  isOpen: boolean,
};
export default class ExampleScroll extends PureComponent<{}, State> {
  bottomRef: any;
  state: State = { isOpen: false };
  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });
  scrollToBottom = () => this.bottomRef.scrollIntoView(true);

  render() {
    const { isOpen } = this.state;
    const actions = [
      { text: 'Close', onClick: this.close },
      { text: 'Scroll to bottom', onClick: this.scrollToBottom },
    ];

    return (
      <TallContainer>
        <Paragraph>
          Modals prevent the window from being scrolled both natively and
          programatically. This means that browser quirks such as{' '}
          <code>scrollIntoView</code> scrolling the window instead of only the
          closest scroll parent will be prevented.
        </Paragraph>
        <Button onClick={this.open}>Open Modal</Button>

        {isOpen && (
          <Modal actions={actions} onClose={this.close} heading="Modal Title">
            <Lorem count={10} />
            <div
              ref={r => {
                this.bottomRef = r;
              }}
            />
          </Modal>
        )}
      </TallContainer>
    );
  }
}
