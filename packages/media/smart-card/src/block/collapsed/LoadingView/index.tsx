import * as React from 'react';
import Spinner from '@atlaskit/spinner';
import { SingleLineLayout } from '../SingleLineLayout';

export interface LoadingViewProps {}

export class LoadingView extends React.Component<LoadingViewProps> {
  render() {
    return (
      <SingleLineLayout left={<Spinner size="small" />} middle="Loading..." />
    );
  }
}
