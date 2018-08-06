import * as React from 'react';
import { FormattedMessage } from 'react-intl';
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
        <h3>
          <FormattedMessage id="global-search.no-results-title" />
        </h3>
        <p>
          <FormattedMessage id="global-search.no-results-body" />
        </p>
      </NoResultsWrapper>
    );
  }
}
