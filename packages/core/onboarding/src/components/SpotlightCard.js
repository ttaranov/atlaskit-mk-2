// @flow
import React, { type Node, type ElementType } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { colors, typography, gridSize } from '@atlaskit/theme';
import Card from './Card';
import SpotlightActions from './SpotlightActions';
import { getSpotlightTheme } from './theme';
import type { ActionsType } from '../types';

type CardTheme = {
  container: () => any,
};

type Props = {
  /** Buttons to render in the footer */
  actions?: ActionsType,
  /** An optional element rendered to the left of the footer actions */
  actionsBeforeElement?: Node,
  /** The content of the card */
  children?: Node,
  /** The container elements rendered by the component */
  components?: {
    Header?: ElementType,
    Footer?: ElementType,
  },
  /** The heading to be rendered above the body */
  heading?: Node,
  /** An optional element rendered to the right of the heading */
  headingAfterElement?: Node,
  /** An image to render above the heading */
  image?: Node,
  /** Removes elevation styles if set */
  isFlat: boolean,
  /** the theme of the card */
  theme?: CardTheme => CardTheme,
  width?: number,
  styles: Object,
  innerRef?: Function,
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

class SpotlightCard extends React.Component<Props> {
  static defaultProps = {
    width: 400,
    isFlat: false,
    components: {},
  };
  render() {
    const {
      actions,
      actionsBeforeElement,
      children,
      components,
      isFlat,
      heading,
      headingAfterElement,
      image,
      innerRef,
      styles,
      width,
    } = this.props;
    const { Header = DefaultHeader, Footer = DefaultFooter } = components;
    return (
      <ThemeProvider theme={getSpotlightTheme}>
        <Card
          innerRef={innerRef}
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
          theme={({ container }) => ({
            container: () => ({
              background: colors.P300,
              color: colors.N0,
              width: `${Math.min(Math.max(width, 160), 600)}px`,
              boxShadow: !isFlat
                ? `0 4px 8px -2px ${colors.N50A}, 0 0 1px ${colors.N60A}`
                : undefined,
              ...container(),
              ...styles,
            }),
          })}
        >
          {children}
        </Card>
      </ThemeProvider>
    );
  }
}

export default SpotlightCard;
