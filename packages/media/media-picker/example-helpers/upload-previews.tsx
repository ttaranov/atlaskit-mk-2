import * as React from 'react';
import { UploadPreview } from './upload-preview';
import { LocalUploadComponent } from '../src/components/localUpload';
import { UploadsStartEventPayload } from '../src';
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

  componentDidUpdate(prevProps: PreviewsDataProps) {
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
    const { previewsData } = this.state;
    const { files } = event;

    const newPreviewData: PreviewData[] = files.map(file => {
      const { id, upfrontId } = file;

      return {
        fileId: id,
        upfrontId,
      };
    });

    this.setState({
      previewsData: [...previewsData, ...newPreviewData],
    });
  };

  private setupMediaPickerEventListeners() {
    const picker = this.props.picker;

    picker.on('uploads-start', this.onUploadsStart);
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
        upfrontId={previewsData.upfrontId}
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
