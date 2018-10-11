// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import SectionMessage from '../src';

const Padding = styled.div`
  padding: 8px;
`;

const Example = () => (
  <Fragment>
    <Padding>
      <SectionMessage apperance="authentication">
        <p>Some quick information about a successful action</p>
      </SectionMessage>
    </Padding>
    <Padding>
      <SectionMessage appearance="warning">
        <p>
          The page you have visited has some problems. You should be careful
          with how you proceed
        </p>
        <p>
          Assuming you have taken this warning into account, you can probably
          move forward
        </p>
      </SectionMessage>
    </Padding>
    <Padding>
      <SectionMessage appearance="error">
        <p>There is an error in this content.</p>
        <p> Likely you will need to redo something or make a change</p>
      </SectionMessage>
    </Padding>
    <Padding>
      <SectionMessage appearance="confirmation">
        <p>Just lettiong you know that we succeeded at what we were trying. </p>
        <p>Hope you have a lovely day</p>
      </SectionMessage>
    </Padding>
    <Padding>
      <SectionMessage appearance="change">
        <p>Sometimes we could all do with a change</p>
      </SectionMessage>
    </Padding>
  </Fragment>
);

export default Example;
