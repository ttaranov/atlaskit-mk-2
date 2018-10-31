// @flow
import React, { type Node, type ElementType } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import {
  borderRadius,
  gridSize,
  layers,
  math,
  Theme,
  typography,
} from '@atlaskit/theme';
import { ActionItems, ActionItem } from '../styled/Dialog';
import type { ActionsType } from '../types';

export type CardTheme = {
  container: () => Object,
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
  /** The image to render above the heading. Can be a url or a Node. */
  image?: string | Node,
  /** the theme of the card */
  theme?: CardTheme => CardTheme,
  innerRef?: Function,
};

const Container = styled.div`
  ${({ theme }) => theme};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${math.multiply(gridSize, 2)}px ${math.multiply(gridSize, 2.5)}px;
`;

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
  align-items: center;
  padding-top: ${gridSize}px;
`;

// IE11 and Edge: z-index needed because fixed position calculates z-index relative
// to body insteadof nearest stacking context (Portal in our case).
const defaultTheme = (theme: CardTheme): CardTheme => ({
  container: () => ({
    overflow: 'auto',
    borderRadius: `${borderRadius()}px`,
    height: 'fit-content',
    zIndex: `${layers.spotlight() + 1}`,
    ...(theme.container ? theme.container() : null),
  }),
});

const Card = ({
  actions = [],
  actionsBeforeElement,
  children,
  components = {},
  image,
  heading,
  headingAfterElement,
  theme,
  innerRef,
}: Props) => {
  const { Header = DefaultHeader, Footer = DefaultFooter } = components;
  return (
    // $FlowFixMe
    <Theme theme={defaultTheme}>
      {/* $FlowFixMe */}
      <Theme theme={theme}>
        {({ container }) => {
          return (
            <Container theme={container} innerRef={innerRef}>
              {typeof image === 'string' ? <img src={image} alt="" /> : image}
              <Body>
                {heading || headingAfterElement ? (
                  <Header>
                    <Heading>{heading}</Heading>
                    {/* Always need an element so space-between alignment works */}
                    {headingAfterElement || <span />}
                  </Header>
                ) : null}
                {children}
                {actions.length > 0 || actionsBeforeElement ? (
                  <Footer>
                    {/* Always need an element so space-between alignment works */}
                    {actionsBeforeElement || <span />}
                    <ActionItems>
                      {actions.map(({ text, key, ...rest }, idx) => {
                        return (
                          <ActionItem
                            key={
                              key ||
                              (typeof text === 'string' ? text : `${idx}`)
                            }
                          >
                            <Button {...rest}>{text}</Button>
                          </ActionItem>
                        );
                      })}
                    </ActionItems>
                  </Footer>
                ) : null}
              </Body>
            </Container>
          );
        }}
      </Theme>
    </Theme>
  );
};

// $FlowFixMe - flow doesn't know about forwardRef
export default React.forwardRef((props: Props, ref) => (
  <Card {...props} innerRef={ref} />
));
