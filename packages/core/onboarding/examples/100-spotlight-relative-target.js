// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { Spotlight, SpotlightManager, SpotlightTarget } from '../src';

type State = {
  active: boolean,
};

const RelativeDiv = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  top: 100px;
  left: 100px;
  border-radius: 3px;
  background-color: grey;
`;

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
            <RelativeDiv />
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
