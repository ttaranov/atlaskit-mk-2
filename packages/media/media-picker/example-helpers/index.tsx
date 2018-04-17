import * as React from 'react';
import { PreviewImage } from './styled';
import { UploadPreviewUpdateEventPayload } from '../src/domain/uploadEvent';
import { isImagePreview } from '../src/domain/preview';

export type AuthEnvironment = 'asap' | 'client';

export const renderPreviewImage = (
  { preview, file }: UploadPreviewUpdateEventPayload,
  key: number,
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
    <div key={key}>
      {dimensionsInfo}
      <PreviewImage src={preview.src} id={file.id} />
    </div>
  );
};
