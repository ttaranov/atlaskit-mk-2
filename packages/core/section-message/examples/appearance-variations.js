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
      <SectionMessage apperance="authentication" title="More">
        <div>I count the steps from one end of my island to the other</div>
        <div>It{"'"}s a hundred steps from where I sleep to the sea</div>
      </SectionMessage>
    </Padding>
    <Padding>
      <SectionMessage appearance="warning">
        <div>And when I say I{"'"}ve learned all there is to know</div>
        <div>Well there{"'"}s another little island lesson</div>
        <div>Gramma Tala shows me</div>
      </SectionMessage>
    </Padding>
    <Padding>
      <SectionMessage appearance="error">
        <div>I know where I am from the scent of the breeze</div>
        <div>The ascent of the climb</div>
        <div>From the tangle of the trees</div>
      </SectionMessage>
    </Padding>
    <Padding>
      <SectionMessage appearance="confirmation">
        <div>From the angle of the mountain</div>
        <div>To the sand on our island shore</div>
        <div>I{"'"}ve been here before</div>
      </SectionMessage>
    </Padding>
    <Padding>
      <SectionMessage appearance="change">
        <div>From the angle of the mountain</div>
        <div>To the sand on our island shore</div>
        <div>I{"'"}ve been here before</div>
      </SectionMessage>
    </Padding>
  </Fragment>
);

export default Example;
