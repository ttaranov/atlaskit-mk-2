import * as React from 'react';
import ImageLoader from 'react-render-image';
import ImageIcon from '@atlaskit/icon/glyph/image';
import NoImageIcon from './NoImageIcon';
import { Wrapper, ImageWrapper, IconWrapper } from './styled';

export const LoadingView = () => (
  <IconWrapper>
    <ImageIcon size="xlarge" label="loading" />
  </IconWrapper>
);

export const NoImageView = () => (
  <IconWrapper>
    <NoImageIcon />
  </IconWrapper>
);

export const LoadedView = ({ url }: { url: string }) => (
  <ImageWrapper url={url} />
);

export interface CardPreviewProps {
  isPlaceholder?: boolean;
  url?: string;
}

export default class CardPreview extends React.Component<CardPreviewProps> {
  renderContent() {
    const { isPlaceholder, url } = this.props;

    if (isPlaceholder) {
      return <LoadingView />;
    }

    if (!url) {
      return <NoImageView />;
    }

    return (
      <ImageLoader
        src={url}
        loading={<LoadingView />}
        loaded={<LoadedView url={url} />}
        errored={<NoImageView />}
      />
    );
  }

  render() {
    return <Wrapper>{this.renderContent()}</Wrapper>;
  }
}
