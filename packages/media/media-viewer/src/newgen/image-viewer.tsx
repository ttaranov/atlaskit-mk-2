import * as React from 'react';
import { ImageDetails } from './domain';
import { Img } from './styled';

export type Props = {
  image: ImageDetails;
};

export const ImageViewer: React.StatelessComponent<Props> = ({ image }) => {
  return (
    <Img
      src={image.mediumSizeUrl || image.thumbnailUrl}
    />
  );
}