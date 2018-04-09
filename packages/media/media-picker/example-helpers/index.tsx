import * as React from 'react';
import {
  PreviewImage,
  PreviewImageWrapper,
  ProgressCircleWrapper,
} from './styled';
import { isImagePreview, Preview } from '../src/domain/preview';
import Circle from 'react-circle';

export type AuthEnvironment = 'asap' | 'client';

export interface PreviewData {
  readonly fileId: string;
  readonly preview: Preview;
  isProcessed: boolean;
  uploadingProgress: number;
}

export const renderPreviewImage = (
  { fileId, preview, isProcessed, uploadingProgress }: PreviewData,
  key,
) => {
  if (!isImagePreview(preview)) {
    return;
  }

  const dimensions = preview.dimensions;
  const dimensionsInfo = dimensions ? (
    <div>
      Original dimensions ({dimensions.width} x {dimensions.height})
    </div>
  ) : null;

  return (
    <PreviewImageWrapper key={key}>
      {dimensionsInfo}
      <PreviewImage fadedOut={!isProcessed} src={preview.src} id={fileId} />
      {!isProcessed ? (
        <ProgressCircleWrapper>
          <Circle
            textColor="#172B4D"
            progressColor="#0052CC"
            bgColor="#DEEBFF"
            progress={uploadingProgress}
          />
        </ProgressCircleWrapper>
      ) : null}
    </PreviewImageWrapper>
  );
};
