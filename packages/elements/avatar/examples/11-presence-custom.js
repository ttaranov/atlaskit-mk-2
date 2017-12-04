// @flow
import React from 'react';
import styled from 'styled-components';
import { Note, HR } from '../examples-util/styled';
import tickInlineSvg from '../examples-util/tick.svg';
import WithAllAvatarSizes from '../examples-util/with-all-avatar-sizes';

// the raw tick svg is wrapped in " quotation marks so we will clean it:

const cleanTickInlineSvg: string = tickInlineSvg.replace(/"/g, '');

const Tick = props => <img alt="tick" src={cleanTickInlineSvg} {...props} />;

const DivPresence = styled.div`
  align-items: center;
  background-color: rebeccapurple;
  color: white;
  display: flex;
  font-size: 0.75em;
  font-weight: 500;
  height: 100%;
  justify-content: center;
  text-align: center;
  width: 100%;
`;

export default () => (
  <div>
    <h2>Custom Presence</h2>
    <Note size="large">
      Provide a react element to the <code>presence</code> property
    </Note>
    <h5>SVG</h5>
    <Note>Using a custom svg as the presence</Note>
    <WithAllAvatarSizes
      presence={
        <Tick role="presentation" style={{ height: '100%', width: '100%' }} />
      }
    />
    <HR />
    <h5>Your own component</h5>
    <Note>This example shows using a styled div as a presence.</Note>
    <WithAllAvatarSizes presence={<DivPresence>1</DivPresence>} />
    <WithAllAvatarSizes
      appearance="square"
      presence={<DivPresence>1</DivPresence>}
    />
  </div>
);
