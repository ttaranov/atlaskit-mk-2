import * as React from 'react';
import { Frame } from '../Frame';
import Spinner from '@atlaskit/spinner';
import { IconAndTitleLayout } from '../IconAndTitleLayout';

export interface ResolvingViewProps {
  url: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export class ResolvingView extends React.Component<ResolvingViewProps> {
  render() {
    const { url, isSelected, onClick } = this.props;
    return (
      <Frame isSelected={isSelected} onClick={onClick}>
        <IconAndTitleLayout icon={<Spinner size="small" />} title={url}>
          - To see a link preview, connect your account
        </IconAndTitleLayout>
      </Frame>
    );
  }
}
