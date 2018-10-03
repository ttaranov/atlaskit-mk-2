// @flow
import React, { type Node, type ElementType } from 'react';
import styled from 'styled-components';
import {
  borderRadius,
  gridSize,
  math,
  typography,
  Theme,
} from '@atlaskit/theme';

type CardTheme = {
  container: () => any,
};

export type Props = {
  children: Node,
  footer?: ElementType,
  header?: ElementType,
  image?: ElementType,
  theme: CardTheme => CardTheme,
};

const Container = styled.div`
  overflow: auto;
  border-radius: ${borderRadius}px;
  height: fit-content;
  ${({ theme }) => theme};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${math.multiply(gridSize, 2)}px ${math.multiply(gridSize, 2.5)}px;
`;

const Card = ({
  children,
  footer: Footer,
  header: Header,
  image: Image,
  theme,
}: Props) => (
  <Theme values={theme}>
    {({ container }) => (
      <Container theme={container}>
        {Image && <Image />}
        <Body>
          {Header && <Header />}
          {children}
          {Footer && <Footer />}
        </Body>
      </Container>
    )}
  </Theme>
);

export default Card;
