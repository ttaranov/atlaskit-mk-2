import * as React from 'react';
import styled from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';
import NoResultsImage from '../assets/NoResultsImage';

const NoResultsWrapper = styled.div`
  text-align: center;
  margin-top: ${math.multiply(gridSize, 4)}px;
  margin-bottom: ${math.multiply(gridSize, 4)}px;
`;

export default class NoResults extends React.Component {
  render() {
    return (
      <NoResultsWrapper>
        <NoResultsImage />
        <h3>We couldn't find any search results.</h3>
        <p>Try a different query, or use more specialized searches below.</p>
      </NoResultsWrapper>
    );
  }
}
