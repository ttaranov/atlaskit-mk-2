// @flow

import React, { Component, Fragment } from 'react';
import Lorem from 'react-lorem-component';

import {
  Spotlight,
  SpotlightManager,
  SpotlightPulse,
  SpotlightTarget,
} from '../src';
import { HighlightGroup, Highlight } from './styled';

type State = {
  active: boolean,
};

const Base = props => <div style={{ paddingBottom: 40 }} {...props} />;
const Paragraph = ({ position }: { position: number }) => (
  <Fragment>
    <h3>{position}</h3>
    <Lorem seed={position} count={1} style={{ marginBottom: 20 }} />
  </Fragment>
);

export default class SpotlightAutoscrollExample extends Component<*, State> {
  constructor() {
    super();
    this.state = {
      active: false,
    };
  }
  show = () => this.setState({ active: true });
  hide = () => this.setState({ active: false });
  render() {
    const { active } = this.state;
    return (
      <SpotlightManager component={Base}>
        <p>
          To save some time for consumers and provide a delightfull experience
          to users we check whether the target element is within the viewport
          before rendering each spotlight dialog.
        </p>
        <p>Scroll down to see the target element.</p>
        <p style={{ marginBottom: '1em' }}>
          <button onClick={this.show}>Show</button>
        </p>

        <Lorem count={10} style={{ marginBottom: 20 }} />

        <HighlightGroup>
          <SpotlightTarget name="scroll-behaviour">
            <Highlight color="red">
              I&apos;m out of view{' '}
              <span role="img" aria-label="sad face">
                😞
              </span>
            </Highlight>
          </SpotlightTarget>
        </HighlightGroup>

        <Lorem count={10} style={{ marginTop: 20 }} />

        <p style={{ marginBottom: '1em' }}>
          <button onClick={this.show}>Show</button>
        </p>

        {active && (
          <Spotlight
            actions={[{ onClick: this.hide, text: 'Got it' }]}
            dialogPlacement="bottom left"
            heading="Aww, yiss!"
            key="scroll-behaviour"
            target="scroll-behaviour"
            targetReplacement={rect => (
              <SpotlightPulse style={{ position: 'absolute', ...rect }}>
                <Highlight color="green" style={{ width: rect.width }}>
                  I&apos;m in view{' '}
                  <span role="img" aria-label="happy face">
                    😌
                  </span>
                </Highlight>
              </SpotlightPulse>
            )}
          >
            <Lorem count={1} />
          </Spotlight>
        )}
      </SpotlightManager>
    );
  }
}
