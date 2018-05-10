import * as React from 'react';
import { Image } from './styled';

export interface IconImageProps {
  src: string;
  alt?: string;
  title?: string;
  size?: number;
}

export class IconImage extends React.Component<IconImageProps> {
  render() {
    const { src, alt = '', title, size = 16 } = this.props;
    return <Image src={src} alt={alt} title={title} size={size} />;
  }
}
