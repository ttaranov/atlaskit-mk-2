import * as React from 'react';
import { PreviewImage } from './styled';

export type AuthEnvironment = 'asap' | 'client';

export const renderPreviewImage = ({ preview, file }, key) => {
  if (!preview || !preview.src) {
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
