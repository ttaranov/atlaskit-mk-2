// @flow
import React, { type Node } from 'react';
import { css } from 'styled-components';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import ButtonBase from '../src/components/Button-v2';
import AkButton from '../src/components/AtlaskitButton';
import TrelloButton from '../src/components/TrelloButton';
import CurrentButton from '../src';

const RainbowButton = (props: { children: Node }) => (
  <ButtonBase
    iconBefore={<AtlassianIcon />}
    styles={{
      root: css`
        background: linear-gradient(45deg, #e66465, #9198e5);
        color: white;
        font-size: 1em;
        height: 2.5em;
        padding: 0.25em 1em;
        border: none;
        border-radius: 3px;
        &:hover {
          opacity: 0.95;
          cursor: pointer;
        }
        &:active {
          opacity: 1;
        }
      `,
    }}
  >
    {props.children}
  </ButtonBase>
);

export default () => (
  <div>
    <h2>Basic Button</h2>
    <ButtonBase onClick={() => console.log('base click')}>Click me</ButtonBase>
    <ButtonBase
      iconBefore={<AtlassianIcon />}
      onClick={() => console.log('base click')}
    >
      Click me
    </ButtonBase>
    <h2>Atlaskit Button</h2>
    <AkButton appearance="primary">Click me</AkButton>
    <AkButton
      iconBefore={<AtlassianIcon />}
      onClick={() => console.log('ak click')}
    >
      Click me
    </AkButton>
    <CurrentButton
      iconBefore={<AtlassianIcon />}
      onClick={() => console.log('ak click')}
    >
      Click me
    </CurrentButton>
    <h2>Trello Button</h2>
    <TrelloButton onClick={() => console.log('trello click')}>
      Click me
    </TrelloButton>
    <TrelloButton
      iconBefore={<AtlassianIcon />}
      appearance="primary"
      onClick={() => console.log('trello click')}
    >
      Click me
    </TrelloButton>
    <TrelloButton
      appearance="danger"
      onClick={() => console.log('trello click')}
    >
      Click me
    </TrelloButton>
    <h2>Custom Button</h2>
    <RainbowButton>Click me</RainbowButton>
  </div>
);
