import React, { Component } from 'react';
import Lorem from 'react-lorem-component';

import { Spotlight, SpotlightPulse, SpotlightTarget } from '../../../src';
import { HighlightGroup, Highlight } from '../../styled';

export default class Example extends Component {
  state = { active: false };
  show = () => this.setState({ active: true });
  hide = () => this.setState({ active: false });
  render() {
    const { active } = this.state;

    return (
      <div style={{ paddingBottom: 40 }}>
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
          <SpotlightTarget name="unique">
            <Highlight color="red">I&apos;m out of view 😞</Highlight>
          </SpotlightTarget>
        </HighlightGroup>

        <Lorem count={10} style={{ marginTop: 20 }} />

        {active && (
          <Spotlight
            actions={[{ onClick: this.hide, text: 'Got it' }]}
            dialogPlacement="bottom left"
            heading="Aww, yiss!"
            key="unique"
            target="unique"
            targetReplacement={rect => (
              <SpotlightPulse style={{ position: 'absolute', ...rect }}>
                <Highlight color="green" style={{ width: rect.width }}>
                  I&apos;m in view 😌
                </Highlight>
              </SpotlightPulse>
            )}
          >
            <Lorem count={1} />
          </Spotlight>
        )}
      </div>
    );
  }
}
