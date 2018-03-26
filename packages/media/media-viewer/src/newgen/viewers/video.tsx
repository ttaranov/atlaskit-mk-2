import * as React from 'react';
import { FilePreview } from '../domain';
import { Video } from '../styled';

export type Props = {
  previewData: FilePreview;
};

export const VideoViewer: React.StatelessComponent<Props> = ({ previewData }) => {
  return (
    <Video controls src={previewData.objectUrl}/>
  );
}