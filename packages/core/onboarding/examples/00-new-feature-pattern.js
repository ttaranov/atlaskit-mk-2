// @flow
import React from 'react';
import styled from 'styled-components';
import Button, { ButtonGroup } from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import {
  //   Spotlight,
  SpotlightPulse,
  //   SpotlightManager,
  //   SpotlightTarget,
  SpotlightTransition,
} from '../src';
import Spotlight from '../src/components/SpotlightNext';
import SpotlightDialog from '../src/components/SpotlightDialog';

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
        <ButtonGroup>
          <Spotlight>
            {({ targetRef }) => (
              <React.Fragment>
                <Button
                  innerRef={targetRef}
                  onClick={() =>
                    this.setState({ spotlightVisible: !spotlightVisible })
                  }
                >
                  I am a new feature
                </Button>
                <SpotlightTransition>
                  {spotlightVisible && (
                    <SpotlightDialog
                      heading="Switch it up"
                      actionsBeforeElement="1/3"
                      actions={[{ onClick: () => {}, text: 'Got it' }]}
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
        </ButtonGroup>
      </Wrapper>
    );
  }
}

export default NewFeature;
