import * as React from 'react';
import { UploadPreview } from './upload-preview';
import { LocalUploadComponent } from '../src/components/localUpload';
import {
  UploadPreviewUpdateEventPayload,
  UploadsStartEventPayload,
} from '../src';
import { PreviewsTitle, PreviewsWrapper } from './styled';
import { PreviewData } from './types';

export interface PreviewsDataState {
  previewsData: PreviewData[];
}

export interface PreviewsDataProps {
  picker: LocalUploadComponent;
}

export class UploadPreviews extends React.Component<
  PreviewsDataProps,
  PreviewsDataState
> {
  state: PreviewsDataState = {
    previewsData: [],
  };

  private updatePreviewDataFile(
    fileId: string,
    progress: number,
    isProcessed: boolean = false,
  ) {
    this.setState(({ previewsData }) => {
      const newPreviewData = previewsData.map(previewData => {
        if (
          previewData.fileId === fileId &&
          (previewData.uploadingProgress !== progress ||
            previewData.isProcessed !== isProcessed)
        ) {
          return {
            ...previewData,
            uploadingProgress: progress,
            isProcessed,
          };
        } else {
          return previewData;
        }
      });
      return { previewsData: newPreviewData };
    });
  }

  componentDidUpdate(
    prevProps: PreviewsDataProps,
    prevState: PreviewsDataState,
  ) {
    prevProps.picker.removeAllListeners();
    this.setupMediaPickerEventListeners();
  }

  componentDidMount() {
    this.setupMediaPickerEventListeners();
  }

  componentWillUnmount() {
    this.props.picker.removeAllListeners();
  }

  onUploadsStart = async (event: UploadsStartEventPayload) => {
    const { files } = event;
    const file = files[0];
    // TODO: render cards passing upfrontId
    const id = await file.upfrontId;

    console.log('onUploadsStart', id);
  };

  private setupMediaPickerEventListeners() {
    const picker = this.props.picker;

    picker.on('uploads-start', this.onUploadsStart);

    picker.on(
      'upload-preview-update',
      (payload: UploadPreviewUpdateEventPayload) => {
        console.log('preview ready');
        const previewData: PreviewData = {
          preview: payload.preview,
          isProcessed: false,
          fileId: payload.file.id,
          uploadingProgress: 0,
        };
        this.setState({
          previewsData: [previewData, ...this.state.previewsData],
        });
      },
    );

    /*
      Following three consequential events use some magic numbers. All of this is for better
      user experience. Here is explanation:

      1. From 0% to 98% percentage shows actual chunk uploading progress.
      2. When all chunks are uploaded and processing has started we show 99%
      3. When processing has finished we show 100% and wait for 750ms. This is done just to give
         user a feedback that uploading has finished.
      4. We hide upload progress
     */

    picker.on('upload-status-update', ({ file: { id }, progress }) => {
      let uploadProgress = Math.round(progress.portion * 98);
      console.log(`upload progress: ${uploadProgress}% for ${id} file`);
      this.updatePreviewDataFile(id, uploadProgress);
    });

    picker.on('upload-processing', ({ file: { id } }) => {
      console.log(`processing has started for ${id} file`);
      this.updatePreviewDataFile(id, 99);
    });

    picker.on('upload-end', ({ file: { id, publicId } }) => {
      console.log(`upload end for ${publicId} (local id: ${id}) file`);
      this.updatePreviewDataFile(id, 100);

      setTimeout(() => {
        this.updatePreviewDataFile(id, 100, true);
      }, 700);
    });

    picker.on('upload-error', data => {
      console.log('upload error:', data);
    });
  }

  private renderPreviews = () => {
    const { previewsData } = this.state;

    return previewsData.map((previewsData, index) => (
      <UploadPreview
        key={`${index}`}
        fileId={previewsData.fileId}
        isProcessed={previewsData.isProcessed}
        preview={previewsData.preview}
        uploadingProgress={previewsData.uploadingProgress}
      />
    ));
  };

  render() {
    return (
      <PreviewsWrapper>
        <PreviewsTitle>Upload previews</PreviewsTitle>
        {this.renderPreviews()}
      </PreviewsWrapper>
    );
  }
}
