import * as React from 'react';
import { PreviewData, renderPreviewImage } from './index';
import { LocalUploadComponent } from '../src/components/localUpload';
import { UploadPreviewUpdateEventPayload } from '../src';
import { PreviewsTitle, PreviewsWrapper } from './styled';

export interface PreviewsDataState {
  previewsData: PreviewData[];
}

export interface PreviewsDataProps {
  picker: LocalUploadComponent;
}

export class PreviewsData extends React.Component<
  PreviewsDataProps,
  PreviewsDataState
> {
  state: PreviewsDataState = {
    previewsData: [],
  };

  private getPreviewData(fileId: string): PreviewData | null {
    return (
      this.state.previewsData.find(preview => preview.fileId === fileId) || null
    );
  }

  private updatePreviewDataFile(
    fileId: string,
    progress: number,
    isProcessed: boolean = false,
  ) {
    const previewData = this.getPreviewData(fileId);
    if (
      previewData &&
      (previewData.uploadingProgress !== progress ||
        previewData.isProcessed !== isProcessed)
    ) {
      previewData.uploadingProgress = progress;
      previewData.isProcessed = isProcessed;
      this.setState({ previewsData: [...this.state.previewsData] });
    }
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

  private setupMediaPickerEventListeners() {
    const picker = this.props.picker;

    picker.on('uploads-start', data => {
      console.log('uploads-start:', data);
    });

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

    return previewsData.map(renderPreviewImage);
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
