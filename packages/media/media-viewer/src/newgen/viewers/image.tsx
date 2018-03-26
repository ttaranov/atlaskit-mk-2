import * as React from 'react';
import { FilePreview } from '../domain';
import { Img } from '../styled';

export type Props = {
  previewData: FilePreview;
};

export const ImageViewer: React.StatelessComponent<Props> = ({ previewData }) => {
  return (
    <Img src={previewData.objectUrl}/>
  );
}