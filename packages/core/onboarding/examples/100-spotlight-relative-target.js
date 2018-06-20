// @flow
import React, { Component } from 'react';

import { Spotlight, SpotlightManager, SpotlightTarget } from '../src';

type State = {
  active: boolean,
};

export default class SpotlightRelativeTarget extends Component<Object, State> {
  state: State = { active: false };
  render() {
    const { active } = this.state;
    return (
      <SpotlightManager>
        <div
          style={{
            backgroundColor: 'lightblue',
          }}
        >
          <div style={{ textAlign: 'center', paddingTop: '2em' }}>
            <button onClick={() => this.setState({ active: true })}>
              Spotlight grey box
            </button>
          </div>
          <SpotlightTarget name="box">
            <div
              style={{
                position: 'relative',
                width: '200px',
                height: '200px',
                top: '100px',
                left: '100px',
                borderRadius: '3px',
                backgroundColor: 'grey',
              }}
            />
          </SpotlightTarget>
        </div>

        {active && (
          <Spotlight
            actions={[
              {
                onClick: () => this.setState({ active: false }),
                text: 'Got it!',
              },
            ]}
            dialogPlacement="bottom left"
            heading="This is a grey box"
            key="box"
            target="box"
          >
            Despite the target being relatively positioned, the spotlight is
            shown in the correct place.
          </Spotlight>
        )}
      </SpotlightManager>
    );
  }
}
