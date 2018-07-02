import * as React from 'react';
import styled from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';
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
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TitleWrapper = styled.div`
  margin: ${math.multiply(gridSize, 2)}px 0;
`;

const ADVANCED_SEARCH_URL = '/wiki/dosearchsite.action';

const Text = ({ url }) => (
  <TextWrapper>
    <TitleWrapper>
      <h3>Search for what you need</h3>
    </TitleWrapper>
    <div>
      Or use <a href={url}>Advanced Search</a> (`shift + enter`) to focus your
      results.
    </div>
  </TextWrapper>
);
export default class EmptyState extends React.Component {
  render() {
    return (
      <Wrapper>
        <ImageWrapper>
          <MaginfyingGlassImage />
        </ImageWrapper>
        <Text url={ADVANCED_SEARCH_URL} />
      </Wrapper>
    );
  }
}
