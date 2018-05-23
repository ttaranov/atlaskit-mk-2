import * as React from 'react';
import {
  PreviewImage,
  PreviewImageWrapper,
  ProgressCircleWrapper,
} from './styled';
import { isImagePreview } from '../src/domain/preview';
import Circle from 'react-circle';
import { PreviewData } from './types';

export class UploadPreview extends React.Component<PreviewData> {
  render() {
    const { isProcessed, preview, fileId, uploadingProgress } = this.props;

    let dimensions;
    if (isImagePreview(preview)) {
      dimensions = preview.dimensions;
    }
    const dimensionsInfo = dimensions ? (
      <div>
        Original dimensions ({dimensions.width} x {dimensions.height})
      </div>
    ) : null;

    return (
      <PreviewImageWrapper>
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
  }
}
