import * as React from 'react';
import { Wrapper, Iframe } from './styled';

export interface URLEmbedCardProps {
  url: string;
  aspectRatio?: number;
  width?: number;
  height?: number;
}

export interface URLEmbedCardState {}

export class URLEmbedCard extends React.Component<
  URLEmbedCardProps,
  URLEmbedCardState
> {
  render() {
    const { url, aspectRatio, width, height } = this.props;
    return (
      <Wrapper aspectRatio={aspectRatio} width={width} height={height}>
        <Iframe src={url} allowFullScreen={true} />
      </Wrapper>
    );
  }
}
