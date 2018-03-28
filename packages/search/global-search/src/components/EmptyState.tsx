import * as React from 'react';
import styled from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';
import EmptyStateImage from '../assets/EmptyStateImage';

const EmptyWrapper = styled.div`
  text-align: center;
  margin-top: ${math.multiply(gridSize, 4)}px;
  margin-bottom: ${math.multiply(gridSize, 4)}px;
`;

export default class EmptyState extends React.Component {
  render() {
    return (
      <EmptyWrapper>
        <EmptyStateImage />
        <h3>We couldn't find any search results.</h3>
        <p>Try a different query, or use more specialized searches below.</p>
      </EmptyWrapper>
    );
  }
}
