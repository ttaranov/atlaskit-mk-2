// @flow
import React, { type Node } from 'react';
import styled, { css, ThemeProvider } from 'styled-components';
import { colors } from '@atlaskit/theme';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import ButtonBase from '../src/components/Button-v2';
import AkButton from '../src/components/AtlaskitButton';
import TrelloButton from '../src/components/TrelloButton';
import CurrentButton from '../src';

const Section = styled.div`
  padding-top: 8px;
`;

const adgLightPallet = {
  primary: {
    main: colors.N30A,
    light: colors.N30A,
    dark: colors.N700,
    contrastText: colors.N400,
  },
  secondary: {
    main: colors.B400,
    light: colors.B300,
    dark: colors.B500,
    contrastText: colors.N0,
  },
};

const adgDarkPallet = {
  primary: {
    main: colors.DN70,
    light: colors.DN60,
    dark: colors.B75,
    contrastText: colors.DN400,
  },
  secondary: {
    main: colors.B100,
    light: colors.B75,
    dark: colors.B200,
    contrastText: colors.DN30,
  },
};

const trelloLightPallet = {
  primary: {
    main: '#d6dadc',
    light: '#e2e4e6',
    dark: '#838c91',
    contrastText: '#333333',
  },
  secondary: {
    main: colors.B400,
    light: colors.B300,
    dark: colors.B500,
    contrastText: '#fff',
  },
};

const trelloDarkPallet = {
  primary: {
    main: '#3a3a3a',
    light: '#4d4d4d',
    dark: '#232323',
    contrastText: '#fff',
  },
  secondary: {
    main: colors.B400,
    light: colors.B300,
    dark: colors.B500,
    contrastText: '#fff',
  },
};

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

type LightDarkProps = { children: Node, light: {}, dark: {} };
type LightDarkState = { mode: string, pallet: {} };

class LightDarkProvider extends React.Component<
  LightDarkProps,
  LightDarkState,
> {
  static getDerivedStateFromProps(nextProps: LightDarkProps) {
    return {
      mode: 'light',
      pallet: nextProps.light,
    };
  }

  state = { mode: 'light', pallet: {} };

  render() {
    const { children, light, dark } = this.props;
    return (
      <div>
        <span>
          <button
            onClick={() => this.setState({ mode: 'light', pallet: light })}
          >
            Light theme
          </button>
          <button onClick={() => this.setState({ mode: 'dark', pallet: dark })}>
            Dark theme
          </button>
        </span>
        <ThemeProvider theme={{ ...this.state }}>
          <Section>{children}</Section>
        </ThemeProvider>
      </div>
    );
  }
}

export default () => (
  <div>
    <h2>Basic Button</h2>
    <Section>
      <ButtonBase onClick={() => console.log('base click')}>
        Click me
      </ButtonBase>
      <ButtonBase
        iconBefore={<AtlassianIcon />}
        onClick={() => console.log('base click')}
      >
        Click me
      </ButtonBase>
    </Section>
    <h2>Atlaskit Button</h2>
    <Section>
      <LightDarkProvider light={adgLightPallet} dark={adgDarkPallet}>
        <div>
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
        </div>
      </LightDarkProvider>
    </Section>
    <h2>Trello Button</h2>
    <Section>
      <LightDarkProvider light={trelloLightPallet} dark={trelloDarkPallet}>
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
      </LightDarkProvider>
    </Section>
    <h2>Custom Button</h2>
    <Section>
      <RainbowButton>Click me</RainbowButton>
    </Section>
  </div>
);
