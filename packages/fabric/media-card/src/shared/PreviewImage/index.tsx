import * as React from 'react';
import { Image } from './styled';

export interface PreviewImageProps {
  src: string;
}

export interface PreviewImageState {}

export default class PreviewImage extends React.Component<
  PreviewImageProps,
  PreviewImageState
> {
  render() {
    const { src } = this.props;
    return <Image src={src} />;
  }
}
