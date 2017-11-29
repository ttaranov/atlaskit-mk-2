import React, { Component } from 'react';
import styled from 'styled-components';
import AtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import Button from '@atlaskit/button';
import { ProgressDots } from '@atlaskit/progress-indicator';

import { Spotlight, SpotlightTarget } from '../../../src';
import { Code, Highlight } from '../../styled';
import welcomeImage from '../../assets/this-is-new-jira.png';

const Spacer = styled.div`
  margin-bottom: 40px;
`;
const Header = styled.div`
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
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

export default class SpotlightLayoutExample extends Component {
  state = { active: null };
  start = (active = 0) => this.setState({ active });
  next = () => this.setState(state => ({ active: state.active + 1 }));
  prev = () => this.setState(state => ({ active: state.active - 1 }));
  finish = () => this.setState({ active: null });
  renderActiveSpotlight() {
    const customFooter = (
      <Footer>
        <Button appearance="help" onClick={this.prev}>
          Prev
        </Button>
        <ProgressDots
          appearance="inverted"
          selectedIndex={4}
          values={['one', 'two', 'three', 'four', 'five']}
        />
        <Button appearance="help" onClick={this.next}>
          Next
        </Button>
      </Footer>
    );

    const variants = [
      <Spotlight
        actions={[{ onClick: this.next, text: 'Next' }]}
        dialogPlacement="bottom left"
        key="children"
        target="children"
      >
        No frills, just text supplied to children.
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: this.prev, text: 'Prev' },
          { onClick: this.next, text: 'Next' },
        ]}
        dialogPlacement="bottom left"
        heading="Heading"
        key="heading"
        target="heading"
      >
        Hey look, I have a heading.
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: this.prev, text: 'Prev' },
          { onClick: this.next, text: 'Next' },
        ]}
        dialogPlacement="bottom left"
        image={welcomeImage}
        key="image"
        target="image"
      >
        Pass a URL path to Spotlight&apos;s <Code>image</Code> property, to
        render a flush image header above the children.
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: this.prev, text: 'Prev' },
          { onClick: this.next, text: 'Next' },
        ]}
        dialogPlacement="bottom left"
        header={customHeader}
        key="header"
        target="header"
      >
        Pass any custom element into <Code>header</Code> to render it above the
        children.
      </Spotlight>,
      <Spotlight
        footer={customFooter}
        dialogPlacement="bottom left"
        key="footer"
        target="footer"
      >
        Pass any custom element into <Code>footer</Code> to render it below the
        children.
      </Spotlight>,
    ];

    return variants[this.state.active];
  }
  render() {
    return (
      <div>
        <Spacer>
          <SpotlightTarget name="children">
            <Highlight color="teal">children</Highlight>
          </SpotlightTarget>
          <p>
            The most basic Spotlight; expects <Code>children</Code>.
          </p>
          <p>
            <button onClick={() => this.start(0)}>Start</button>
          </p>
        </Spacer>

        <Spacer>
          <SpotlightTarget name="heading">
            <Highlight color="green">heading</Highlight>
          </SpotlightTarget>
          <p>
            Spotlight accepts a <Code>heading</Code> property.
          </p>
          <p>
            <button onClick={() => this.start(1)}>Start</button>
          </p>
        </Spacer>

        <Spacer>
          <SpotlightTarget name="image">
            <Highlight color="yellow">image</Highlight>
          </SpotlightTarget>
          <p>
            Pass a URL path to Spotlight&apos;s <Code>image</Code> property to
            render an image above the children, flush with the dialog chrome.
          </p>
          <p>
            <button onClick={() => this.start(2)}>Start</button>
          </p>
        </Spacer>

        <Spacer>
          <SpotlightTarget name="header">
            <Highlight color="red">header</Highlight>
          </SpotlightTarget>
          <p>
            Pass any custom element into <Code>header</Code> to render it above
            the children.
          </p>
          <p>
            <button onClick={() => this.start(3)}>Start</button>
          </p>
        </Spacer>

        <Spacer>
          <SpotlightTarget name="footer">
            <Highlight color="purple">footer</Highlight>
          </SpotlightTarget>
          <p>
            Pass any custom element into <Code>footer</Code> to render it below
            the children.
          </p>
          <p>
            <button onClick={() => this.start(4)}>Start</button>
          </p>
        </Spacer>

        {this.renderActiveSpotlight()}
      </div>
    );
  }
}
