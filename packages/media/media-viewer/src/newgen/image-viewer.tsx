import * as React from 'react';
import { ImageDetails } from './domain';

export type Props = {
  image: ImageDetails;
};

export const ImageViewer: React.StatelessComponent<Props> = ({ image }) => {
  return (
    <img src={image.mediumSizeUrl || image.thumbnailUrl}/>
  );
}