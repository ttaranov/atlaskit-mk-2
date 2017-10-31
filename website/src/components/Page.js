// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';
import { gridSize, colors, math } from '@atlaskit/theme';

const PageContainer = styled.main`
  max-width: 40rem;
  margin: 2rem auto;
  padding: 0 2rem;
`;

type PageProps = {
  children: Node,
};

export default class Page extends React.PureComponent<PageProps> {
  props: PageProps;

  render() {
    return <PageContainer>{this.props.children}</PageContainer>;
  }
}

export const Title = styled.h1`margin-bottom: 1em;`;

export const Section = styled.section`
  margin-top: 3em;

  p {
    line-height: 1.4em;
  }
`;

export const Intro = styled.p`
  color: ${colors.heading};
  font-size: ${math.multiply(gridSize, 2)}px;
  font-weight: 300;
  line-height: 1.4em;
`;
