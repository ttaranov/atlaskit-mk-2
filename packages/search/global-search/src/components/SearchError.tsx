import * as React from 'react';
import Button from '@atlaskit/button';
import { gridSize, math } from '@atlaskit/theme';
import styled from 'styled-components';
import ErrorImage from '../assets/ErrorImage';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

const ErrorWrapper = styled.div`
  text-align: center;
  margin-top: ${math.multiply(gridSize, 4)}px;
`;

export interface Props {
  onRetryClick();
}

export class SearchError extends React.Component<Props> {
  render() {
    const { onRetryClick } = this.props;

    return (
      <ErrorWrapper>
        <ErrorImage />
        <h3>We're having trouble searching.</h3>
        <p>
          <span>It might just be hiccup. Best thing is to </span>
          <Button appearance="link" spacing="none" onClick={onRetryClick}>
            try again
          </Button>.
        </p>
      </ErrorWrapper>
    );
  }
}

export default withAnalyticsEvents({
  onRetryClick: (createEvent, props) => {
    const payload: GasPayload = {
      action: 'clicked',
      actionSubject: 'retryButton',
      eventType: 'ui',
      source: 'globalSearchDrawer',
    };
    createEvent(payload).fire('quick-search');
  },
})(SearchError);
