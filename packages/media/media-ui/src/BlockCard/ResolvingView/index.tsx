import * as React from 'react';
import Spinner from '@atlaskit/spinner';
import { CollapsedFrame } from '../CollapsedFrame';
import { minWidth, maxWidth } from '../dimensions';
import { SingleLineLayout } from '../SingleLineLayout';

export interface BlockCardResolvingViewProps {
  onClick?: () => void;
  isSelected?: boolean;
}

export class BlockCardResolvingView extends React.Component<
  BlockCardResolvingViewProps
> {
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
