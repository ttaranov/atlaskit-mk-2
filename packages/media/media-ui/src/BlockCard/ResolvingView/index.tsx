import * as React from 'react';
import Spinner from '@atlaskit/spinner';
import { CollapsedFrame } from '../CollapsedFrame';
import { minWidth, maxWidth } from '../dimensions';
import { SingleLineLayout } from '../SingleLineLayout';

export interface ResolvingViewProps {
  onClick?: () => void;
  isSelected?: boolean;
}

export class ResolvingView extends React.Component<ResolvingViewProps> {
  render() {
    const { onClick, isSelected } = this.props;
    return (
      <CollapsedFrame
        isSelected={isSelected}
        minWidth={minWidth}
        maxWidth={maxWidth}
        onClick={onClick}
      >
        <SingleLineLayout left={<Spinner size="small" />} middle="Loading..." />
      </CollapsedFrame>
    );
  }
}
