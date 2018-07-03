import * as React from 'react';
import styled from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';
import { akTypographyMixins } from '@atlaskit/util-shared-styles';
import MaginfyingGlassImage from '../assets/MagnifyingGlassImage';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: ${math.multiply(gridSize, 4)}px 0;
`;

const ImageWrapper = styled.div`
  width: 20%;
  height: 20%;
  margin-top: ${math.multiply(gridSize, 11)}px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: ${math.multiply(gridSize, 3)}px;
`;

const Title = styled.h4`
  ${akTypographyMixins.h600};
  margin-bottom: ${math.multiply(gridSize, 2)}px;
  margin-top: 0;
`;

export interface Props {
  advancedSearchUrl: string;
}

const Text = ({ url }) => (
  <TextWrapper>
    <Title>Search for what you need</Title>
    <div>
      Or use <a href={url}>Advanced Search</a> (`shift + enter`) to focus your
      results.
    </div>
  </TextWrapper>
);
export default class NoRecentActivity extends React.Component<Props> {
  render() {
    return (
      <Wrapper>
        <ImageWrapper>
          <MaginfyingGlassImage />
        </ImageWrapper>
        <Text url={this.props.advancedSearchUrl} />
      </Wrapper>
    );
  }
}
