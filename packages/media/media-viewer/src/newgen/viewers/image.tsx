import * as React from 'react';
import { ImagePreview } from '../domain';
import { Img } from '../styled';

export type Props = {
  previewData: ImagePreview;
};

export const ImageViewer: React.StatelessComponent<Props> = ({
  previewData,
}) => {
  return <Img src={previewData.objectUrl} />;
};
