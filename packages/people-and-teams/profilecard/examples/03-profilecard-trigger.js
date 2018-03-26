// @flow
import React from 'react';
import styled from 'styled-components';

import { AkProfilecardTrigger } from '../src';
import { getMockProfileClient } from './helper/util';

const mockClient = getMockProfileClient(10, 0);

export const MainStage = styled.div`
  margin: 16px;
`;

export const Section = styled.div`
  margin: 16px 0;

  h4 {
    margin: 8px 0;
  }
`;

export default function Example() {
  return (
    <MainStage>
      <Section>
        <h4>Profilecard triggered by hover</h4>
        <div>
          Lorem ipsum{' '}
          <AkProfilecardTrigger
            cloudId="DUMMY-10ae0bf3-157e-43f7-be45-f1bb13b39048"
            userId="1"
            position="bottom left"
            resourceClient={mockClient}
            actions={[
              {
                label: 'View profile',
                id: 'view-profile',
                callback: () => {},
              },
            ]}
          >
            <strong>hover over me</strong>
          </AkProfilecardTrigger>{' '}
          dolor sit amet
        </div>
      </Section>
      <Section>
        <h4>Profilecard triggered by click</h4>
        <div>
          Lorem ipsum{' '}
          <AkProfilecardTrigger
            cloudId="DUMMY-10ae0bf3-157e-43f7-be45-f1bb13b39048"
            userId="1"
            position="bottom left"
            resourceClient={mockClient}
            trigger="click"
            actions={[
              {
                label: 'View profile',
                id: 'view-profile',
                callback: () => {},
              },
            ]}
          >
            <strong>click me</strong>
          </AkProfilecardTrigger>{' '}
          dolor sit amet
        </div>
      </Section>
    </MainStage>
  );
}
