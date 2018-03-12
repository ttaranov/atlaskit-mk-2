import * as React from 'react';
import ImageLoader from 'react-render-image';
import LinkGlyph from '@atlaskit/icon/glyph/link';
import { IconImage } from '../IconImage';

export const DefaultIcon = () => <LinkGlyph label="icon" size="small" />;

export const CustomIcon = ({ url, alt }: { url: string; alt: string }) => (
  <IconImage src={url} alt={alt} />
);

export interface LinkIconProps {
  src?: string;
}

export class LinkIcon extends React.Component<LinkIconProps> {
  render() {
    const { src } = this.props;

    if (!src) {
      return <DefaultIcon />;
    }

    return (
      <ImageLoader
        src={src}
        loading={<DefaultIcon />}
        loaded={<CustomIcon url={src} alt="" />}
        errored={<DefaultIcon />}
      />
    );
  }
}
