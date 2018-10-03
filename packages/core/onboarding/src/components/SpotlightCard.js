// @flow
import React, { type Node, type ElementType } from 'react';
import styled, { ThemeProvider, css } from 'styled-components';
import {
  colors,
  elevation as elevations,
  typography,
  gridSize,
} from '@atlaskit/theme';
import Card from './Card';
import SpotlightActions from './SpotlightActions';
import { getSpotlightTheme } from './theme';
import type { ActionsType } from '../types';

type Props = {
  actions?: ActionsType,
  actionsBeforeElement?: Node,
  children?: Node,
  components?: {
    Header?: ElementType,
    Footer?: ElementType,
  },
  elevation?: 0 | 1 | 2 | 3 | 4 | 5,
  heading?: Node,
  headingAfterElement?: Node,
  image?: Node,
  width?: number,
};

const Heading = styled.h4`
  ${typography.h600};
  color: inherit;
`;

const DefaultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: ${gridSize}px;
`;

const DefaultFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: ${gridSize}px;
`;

const SpotlightCard = ({
  actions,
  actionsBeforeElement,
  children,
  components = {},
  elevation = 2,
  heading,
  headingAfterElement,
  image,
  width = 400,
}: Props) => {
  const { Header = DefaultHeader, Footer = DefaultFooter } = components;
  return (
    <ThemeProvider theme={getSpotlightTheme}>
      <Card
        header={() =>
          heading || headingAfterElement ? (
            <Header>
              <Heading>{heading}</Heading>
              {headingAfterElement || <span />}
            </Header>
          ) : null
        }
        footer={() =>
          actions || actionsBeforeElement ? (
            <Footer>
              {actionsBeforeElement || <span />}
              <SpotlightActions items={actions || []} />
            </Footer>
          ) : null
        }
        image={() => image || null}
        theme={() => ({
          container: () => css`
            background: ${colors.P300};
            color: ${colors.N0};
            width: ${Math.min(Math.max(width, 160), 600)}px;
            ${elevation > 0 ? elevations[`e${elevation}00`] : undefined};
          `,
        })}
      >
        {children}
      </Card>
    </ThemeProvider>
  );
};

export default SpotlightCard;
