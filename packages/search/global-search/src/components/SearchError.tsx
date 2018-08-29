import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@atlaskit/button';
import { gridSize, math } from '@atlaskit/theme';
import styled from 'styled-components';
import ErrorImage from '../assets/ErrorImage';

const ErrorWrapper = styled.div`
  text-align: center;
  margin-top: ${math.multiply(gridSize, 4)}px;
`;

export interface Props {
  onRetryClick();
}

export default class SearchError extends React.Component<Props> {
  render() {
    const { onRetryClick } = this.props;

    return (
      <ErrorWrapper>
        <ErrorImage />
        <h3>
          <FormattedMessage id="global-search.search-error-title" />
        </h3>
        <p>
          <span>
            <FormattedMessage
              id="global-search.search-error-body"
              values={{
                link: (
                  <Button
                    appearance="link"
                    spacing="none"
                    onClick={onRetryClick}
                  >
                    <FormattedMessage id="global-search.search-error-body.link" />
                  </Button>
                ),
              }}
            />
          </span>
        </p>
      </ErrorWrapper>
    );
  }
}
