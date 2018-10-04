// @flow
import React, { type Node, type ElementType } from 'react';
import styled from 'styled-components';
import { borderRadius, gridSize, math, Theme } from '@atlaskit/theme';

type CardTheme = {
  container: () => any,
};

export type Props = {
  children: Node,
  footer?: ElementType,
  header?: ElementType,
  image?: ElementType,
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

const defaultTheme = (theme: CardTheme): CardTheme => ({
  container: () => ({
    overflow: 'auto',
    borderRadius: `${borderRadius()}px`,
    height: 'fit-content',
    ...(theme.container ? theme.container() : null),
  }),
});

const Card = ({
  children,
  footer: Footer,
  header: Header,
  image: Image,
  theme = x => x,
  innerRef,
}: Props) => (
  <Theme values={defaultTheme}>
    <Theme values={theme}>
      {({ container }) => {
        console.log(container());
        return (
          <Container theme={container} innerRef={innerRef}>
            {Image && <Image />}
            <Body>
              {Header && <Header />}
              {children}
              {Footer && <Footer />}
            </Body>
          </Container>
        );
      }}
    </Theme>
  </Theme>
);

export default Card;
