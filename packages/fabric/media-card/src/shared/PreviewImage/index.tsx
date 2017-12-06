import * as React from 'react';
import { Image } from './styled';

export interface PreviewImageProps {
  src: string;
}

export default class PreviewImage extends React.Component<PreviewImageProps> {
  render() {
    const { src } = this.props;
    return <Image src={src} />;
  }
}
