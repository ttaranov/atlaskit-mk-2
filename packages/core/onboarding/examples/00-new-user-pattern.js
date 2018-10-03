// @flow
import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { ProgressDots } from '@atlaskit/progress-indicator';
import welcomeImage from './assets/this-is-new-jira.png';
import {
  Spotlight,
  SpotlightPulse,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../src';

import SpotlightCard from '../src/components/SpotlightCard';

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Option = styled.div`
  padding: 4px;
`;

class NewUser extends React.Component<{}> {
  render() {
    return (
      <Wrapper>
        <div>
          <Heading>
            <h2>Welcome to Jira</h2>
            <ProgressDots values={[1, 2, 3]} selectedIndex={0} />
          </Heading>
          <p>
            Tell us about your team so we can personalise your project for you
          </p>
          <SpotlightCard
            heading="Why are you trying Jira Software?"
            elevation={0}
          >
            <Option>
              <Button>For the lols</Button>
            </Option>
            <Option>
              <Button>Learn about Agile</Button>
            </Option>
            <Option>
              <Button>Setting it up for my team</Button>
            </Option>
          </SpotlightCard>
        </div>
      </Wrapper>
    );
  }
}

export default NewUser;
