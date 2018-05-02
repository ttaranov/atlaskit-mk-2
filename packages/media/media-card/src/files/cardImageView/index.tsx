import * as React from 'react';
import { Component } from 'react';
import { MediaType, ImageResizeMode } from '@atlaskit/media-core';

import { CardDimensions, CardStatus } from '../../index';
import { CardAction } from '../../actions';

import { UploadingView } from '../../utils/uploadingView';
import { CardContent } from './cardContent';
import { CardOverlay } from './cardOverlay';
import { Wrapper } from './styled';

export interface FileCardImageViewProps {
  mediaName?: string;
  mediaType?: MediaType;
  fileSize?: string;

  dataURI?: string;
  progress?: number;
  status: CardStatus;

  dimensions?: CardDimensions;
  resizeMode?: ImageResizeMode;

  selectable?: boolean;
  selected?: boolean;

  error?: string;

  actions?: Array<CardAction>;
  onRetry?: () => void;
}

export class FileCardImageView extends Component<FileCardImageViewProps, {}> {
  static defaultProps = {
    resizeMode: 'crop',
  };

  private isDownloadingOrProcessing() {
    const { status } = this.props;
    return status === 'loading' || status === 'processing';
  }

  render() {
    return <Wrapper>{this.getCardContents()}</Wrapper>;
  }

  private getCardContents = (): Array<JSX.Element> | JSX.Element => {
    const { error, status } = this.props;

    if (error) {
      return this.getErrorContents();
    }

    if (status === 'uploading') {
      return this.getUploadingContents();
    }

    return this.getSuccessCardContents();
  };

  private getErrorContents = (): Array<JSX.Element> => {
    const {
      error,
      mediaName,
      mediaType,
      onRetry,
      actions,
      fileSize,
    } = this.props;

    // key is required by React 15
    return [
      <div key={0} className="wrapper" />,
      <CardOverlay
        key={1}
        persistent={true}
        mediaName={mediaName}
        mediaType={mediaType}
        error={error}
        onRetry={onRetry}
        actions={actions}
        subtitle={fileSize}
      />,
    ];
  };

  private getUploadingContents = (): JSX.Element => {
    const { actions, mediaName, progress, dataURI, selectable } = this.props;

    const overlay = selectable ? this.createUploadingCardOverlay() : null;

    return (
      <div className="wrapper">
        <div className="img-wrapper">
          <UploadingView
            title={mediaName}
            progress={progress || 0}
            dataURI={dataURI}
            actions={actions}
          />
        </div>
        {overlay}
      </div>
    );
  };

  private createUploadingCardOverlay = (): JSX.Element => {
    const { mediaType, dataURI, selectable, selected } = this.props;
    const isPersistent = mediaType === 'doc' || !dataURI;

    return (
      <CardOverlay
        persistent={isPersistent}
        selectable={selectable}
        selected={selected}
      />
    );
  };

  private getSuccessCardContents = (): JSX.Element => {
    const { mediaType, dataURI } = this.props;
    const overlay = this.isDownloadingOrProcessing()
      ? null
      : this.createSuccessCardOverlay();

    return (
      <div className="wrapper">
        <div className="img-wrapper">
          <CardContent
            loading={this.isDownloadingOrProcessing()}
            mediaItemType="file"
            mediaType={mediaType}
            dataURI={dataURI}
            crop={this.isCropped}
          />
        </div>
        {overlay}
      </div>
    );
  };

  private createSuccessCardOverlay = (): JSX.Element => {
    const {
      mediaName,
      mediaType,
      fileSize,
      dataURI,
      selectable,
      selected,
      actions,
    } = this.props;
    const isPersistent = mediaType === 'doc' || !dataURI;

    return (
      <CardOverlay
        persistent={isPersistent}
        selectable={selectable}
        selected={selected}
        mediaName={mediaName}
        mediaType={mediaType}
        subtitle={fileSize}
        actions={actions}
      />
    );
  };

  get isCropped() {
    const { resizeMode } = this.props;

    return resizeMode === 'crop';
  }
}

export default FileCardImageView;
