import * as React from 'react';
import Spinner from '@atlaskit/spinner';
import { SingleLineLayout } from '../SingleLineLayout';

export interface ResolvingViewProps {}

export class ResolvingView extends React.Component<ResolvingViewProps> {
  render() {
    return (
      <SingleLineLayout left={<Spinner size="small" />} middle="Loading..." />
    );
  }
}
