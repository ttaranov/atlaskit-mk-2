// @flow
import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { ProgressDots } from '@atlaskit/progress-indicator';
import { SpotlightCard } from '../src';

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

const Tagline = styled.p`
  padding-bottom: 12px;
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
          <Tagline>
            Tell us about your team so we can personalise your project for you
          </Tagline>
          <SpotlightCard heading="Why are you trying Jira Software?" isFlat>
            <Option>
              <Button>Learn about Agile</Button>
            </Option>
            <Option>
              <Button>Explore the product</Button>
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
