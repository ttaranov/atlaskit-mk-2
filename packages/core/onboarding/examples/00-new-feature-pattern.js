// @flow
import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import {
  Spotlight,
  SpotlightPulse,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../src';

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;

class NewFeature extends React.Component<{}, { spotlightVisible: boolean }> {
  state = {
    spotlightVisible: false,
  };
  render() {
    const { spotlightVisible } = this.state;
    return (
      <Wrapper>
        <Spotlight blanketIsTinted={false}>
          {({ targetRef }) => (
            <React.Fragment>
              <SpotlightPulse ref={targetRef}>
                <Button
                  iconBefore={<AddIcon />}
                  onClick={() =>
                    this.setState({ spotlightVisible: !spotlightVisible })
                  }
                />
              </SpotlightPulse>
              <SpotlightTransition>
                {spotlightVisible && (
                  <SpotlightDialog
                    image="https://www.w3schools.com/w3css/img_lights.jpg"
                    targetBgColor="#fff"
                    targetOnClick={() =>
                      this.setState({ spotlightVisible: !spotlightVisible })
                    }
                    footer="1/3"
                  >
                    It is now easier to create an issue. Click on the plus
                    button to create a new issue.
                  </SpotlightDialog>
                )}
              </SpotlightTransition>
            </React.Fragment>
          )}
        </Spotlight>

        <Spotlight>
          {({ targetRef }) => (
            <React.Fragment>
              <Button innerRef={targetRef}>I am a new feature</Button>
              <SpotlightTransition>
                {spotlightVisible && (
                  <SpotlightDialog
                    image="https://www.w3schools.com/w3css/img_lights.jpg"
                    footer="1/3"
                  >
                    It is now easier to create an issue. Click on the plus
                    button to create a new issue.
                  </SpotlightDialog>
                )}
              </SpotlightTransition>
            </React.Fragment>
          )}
        </Spotlight>

        <Button>Another element</Button>
      </Wrapper>
    );
  }
}

export default NewFeature;
