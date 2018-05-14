import * as React from 'react';
import { Outcome } from './domain';
import { FileItem, MediaItem } from '@atlaskit/media-core';
import { Header as HeaderWrapper, LeftHeader, RightHeader } from './styled';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Button from '@atlaskit/button';
import { withObservable, MapProps, Observable } from './with-observable';

export type Props = {
  readonly onClose?: () => void;
  readonly item: Outcome<FileItem, Error>;
};

class Header extends React.Component<Props, {}> {
  render() {
    return (
      <HeaderWrapper>
        <LeftHeader>{this.renderMetadata()}</LeftHeader>
        <RightHeader>
          <Button
            onClick={this.onClose}
            iconBefore={<CrossIcon label="Close" />}
          />
        </RightHeader>
      </HeaderWrapper>
    );
  }

  private onClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  private renderMetadata() {
    const { item } = this.props;
    switch (item.status) {
      case 'PENDING':
        return '';
      case 'SUCCESSFUL':
        return <span>{item.data.details.name || ''}</span>;
      case 'FAILED':
        return '';
    }
  }
}

const mapProps: MapProps<MediaItem, Props, 'item'> = outcome => {
  if (outcome.status === 'SUCCESSFUL') {
    if (outcome.data.type === 'file') {
      return { item: outcome as Outcome<FileItem, any> };
    } else {
      return {
        item: { status: 'FAILED', err: new Error('links are not supported') },
      };
    }
  } else {
    return { item: outcome };
  }
};

export default withObservable<MediaItem, Props, 'item'>(Header, mapProps);
