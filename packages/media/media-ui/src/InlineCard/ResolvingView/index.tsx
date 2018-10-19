import * as React from 'react';
import { Frame } from '../Frame';
import Spinner from '@atlaskit/spinner';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { SpinnerWrapper } from './styled';

export interface InlineCardResolvingViewProps {
  url: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export class InlineCardResolvingView extends React.Component<
  InlineCardResolvingViewProps
> {
  render() {
    const { url, onClick, isSelected } = this.props;
    return (
      <Frame onClick={onClick} isSelected={isSelected}>
        <IconAndTitleLayout
          icon={
            <SpinnerWrapper>
              <Spinner size={16} />
            </SpinnerWrapper>
          }
          title={url}
        >
          - Connect your account to preview links
        </IconAndTitleLayout>
      </Frame>
    );
  }
}
