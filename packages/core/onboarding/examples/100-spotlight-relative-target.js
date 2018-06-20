// @flow
import React, { Component } from 'react';
import Lorem from 'react-lorem-component';

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

        <div style={{ textAlign: 'center', padding: '3em' }}>
          <button onClick={() => this.setState({ active: true })}>
            Spotlight grey box
          </button>
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
            <Lorem count={1} />
          </Spotlight>
        )}
      </SpotlightManager>
    );
  }
}
