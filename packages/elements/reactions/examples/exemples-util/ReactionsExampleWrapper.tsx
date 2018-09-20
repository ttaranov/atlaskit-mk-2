import { AnalyticsViewerContainer } from '@atlaskit/analytics-viewer';
import * as React from 'react';
import { ReactionClient, ReactionContext } from '../../src';
import { MockReactionsClient } from '../../src/client/MockReactionsClient';

export type Props = {
  client?: ReactionClient;
  children: React.ReactChild | React.ReactChild[];
};

export const ReactionsExampleWrapper: React.StatelessComponent<Props> = ({
  children,
  client,
}: Props) => (
  <AnalyticsViewerContainer>
    <ReactionContext client={client}>{children}</ReactionContext>
  </AnalyticsViewerContainer>
);

ReactionsExampleWrapper.defaultProps = {
  client: new MockReactionsClient(500),
};
