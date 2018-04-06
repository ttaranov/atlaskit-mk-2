import * as React from 'react';
import { VideoPreview } from '../domain';
import { Video } from '../styled';

export type Props = {
  previewData: VideoPreview;
};

export const VideoViewer: React.StatelessComponent<Props> = ({
  previewData,
}) => {
  return <Video controls src={previewData.src} />;
};
