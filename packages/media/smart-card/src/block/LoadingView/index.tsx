import * as React from 'react';
import Spinner from '@atlaskit/spinner';
import { Frame, Text } from './styled';

export interface LoadingViewProps {
  minWidth?: number;
  maxWidth?: number;
}

export class LoadingView extends React.Component<LoadingViewProps> {
  render() {
    const { minWidth, maxWidth } = this.props;
    return (
      <Frame minWidth={minWidth} maxWidth={maxWidth}>
        <Spinner size="small" />
        <Text>Loading...</Text>
      </Frame>
    );
  }
}
