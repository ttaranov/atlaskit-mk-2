// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import Lorem from 'react-lorem-component';
import AtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import Button from '@atlaskit/button';
import { colors } from '@atlaskit/theme';
import { ProgressDots } from '@atlaskit/progress-indicator';

import { Modal } from '../../src';
import { Code } from '../styled';
import welcomeImage from '../assets/this-is-new-jira.png';

const Spacer = styled.div`
  margin-bottom: 40px;
`;
const Header = styled.div`
  align-items: center;
  background-color: ${colors.P400};
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
`;
const Footer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
`;
const customHeader = (
  <Header>
    <h4>Custom Header</h4>
    <AtlassianIcon label="Atlassian" />
  </Header>
);
const Text = () => <Lorem count={1} style={{ marginTop: '1em' }} />;

type State = {
  active: number | null,
};

export default class ModalLayoutExample extends Component<*, State> {
  state: State = { active: null };
  start = (active: number = 0) => this.setState({ active });
  next = () => this.setState(state => ({ active: (state.active || 0) + 1 }));
  prev = () => this.setState(state => ({ active: (state.active || 0) - 1 }));
  finish = () => this.setState({ active: null });
  renderActiveModal() {
    const customFooter = (
      <Footer>
        <Button appearance="subtle-link" onClick={this.prev}>
          Prev
        </Button>
        <ProgressDots
          appearance="help"
          selectedIndex={4}
          values={['one', 'two', 'three', 'four', 'five']}
        />
        <Button appearance="help" onClick={this.next}>
          Next
        </Button>
      </Footer>
    );

    const variants = [
      <Modal
        actions={[{ onClick: this.next, text: 'Next' }]}
        key="children"
        width="small"
      >
        <p>No frills, just text supplied to children.</p>
        <Text />
      </Modal>,
      <Modal
        actions={[
          { onClick: this.next, text: 'Continue' },
          { onClick: this.prev, text: 'Back' },
        ]}
        heading="Heading"
        key="heading"
        width="small"
      >
        <p>Hey look, I have a heading.</p>
        <Text />
      </Modal>,
      <Modal
        actions={[
          { onClick: this.next, text: 'Continue' },
          { onClick: this.prev, text: 'Back' },
        ]}
        image={welcomeImage}
        key="image"
        width="small"
      >
        Pass a URL path to Modal&apos;s <Code>image</Code> property, to render a
        flush image header above the children.
      </Modal>,
      <Modal
        actions={[
          { onClick: this.next, text: 'Continue' },
          { onClick: this.prev, text: 'Back' },
        ]}
        header={customHeader}
        key="header"
        width="small"
      >
        Pass any custom element into <Code>header</Code> to render it above the
        children.
      </Modal>,
      <Modal footer={customFooter} key="footer" width="small">
        Pass any custom element into <Code>footer</Code> to render it below the
        children.
      </Modal>,
    ];

    return variants[this.state.active];
  }
  render() {
    return (
      <div>
        <Spacer>
          <h4>Children</h4>
          <p>
            The most basic Modal; expects <Code>children</Code>.
          </p>
          <p>
            <button onClick={() => this.start(0)}>Start</button>
          </p>
        </Spacer>

        <Spacer>
          <h4>Heading</h4>
          <p>
            Modal accepts a <Code>heading</Code> property.
          </p>
          <p>
            <button onClick={() => this.start(1)}>Start</button>
          </p>
        </Spacer>

        <Spacer>
          <h4>Image</h4>
          <p>
            Pass a URL path to Modal&apos;s <Code>image</Code> property to
            render an image above the children, flush with the dialog chrome.
          </p>
          <p>
            <button onClick={() => this.start(2)}>Start</button>
          </p>
        </Spacer>

        <Spacer>
          <h4>Header</h4>
          <p>
            Pass any custom element into <Code>header</Code> to render it above
            the children.
          </p>
          <p>
            <button onClick={() => this.start(3)}>Start</button>
          </p>
        </Spacer>

        <Spacer>
          <h4>Footer</h4>
          <p>
            Pass any custom element into <Code>footer</Code> to render it below
            the children.
          </p>
          <p>
            <button onClick={() => this.start(4)}>Start</button>
          </p>
        </Spacer>

        {this.renderActiveModal()}
      </div>
    );
  }
}
