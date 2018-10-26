import * as React from 'react';
import { Component, ReactNode } from 'react';
import { MediaType, ImageResizeMode } from '@atlaskit/media-core';

import { CardDimensions, CardStatus } from '../../index';
import { CardAction } from '../../actions';

import { UploadingView } from '../../utils/uploadingView';
import { CardContent } from './cardContent';
import { CardOverlay } from './cardOverlay';
import { Wrapper } from './styled';
import { isLoadingImage } from '../../utils/isLoadingImage';

export interface FileCardImageViewProps {
  readonly mediaName?: string;
  readonly mediaType?: MediaType;
  readonly fileSize?: string;

  readonly dataURI?: string;
  readonly progress?: number;
  readonly status: CardStatus;

  readonly dimensions?: CardDimensions;
  readonly resizeMode?: ImageResizeMode;

  readonly disableOverlay?: boolean;
  readonly selectable?: boolean;
  readonly selected?: boolean;

  readonly error?: ReactNode;

  readonly actions?: Array<CardAction>;
  readonly onRetry?: () => void;
  readonly previewOrientation?: number;
}

export class FileCardImageView extends Component<FileCardImageViewProps, {}> {
  static defaultProps = {
    resizeMode: 'crop',
    disableOverlay: false,
  };

  private isDownloadingOrProcessing() {
    const { status, dataURI, mediaType } = this.props;

    return (
      status === 'loading' ||
      status === 'processing' ||
      isLoadingImage(mediaType, dataURI)
    );
  }

  render() {
    const { disableOverlay, selectable, selected, mediaType } = this.props;
    return (
      <Wrapper
        disableOverlay={disableOverlay}
        selectable={selectable}
        selected={selected}
        mediaType={mediaType}
      >
        {this.getCardContents()}
      </Wrapper>
    );
  }

  private getCardContents = (): Array<JSX.Element> | JSX.Element => {
    const { status } = this.props;

    switch (status) {
      case 'error':
        return this.getErrorContents();
      case 'failed-processing':
        return this.getFailedContents();
      case 'uploading':
        return this.getUploadingContents();
      default:
        return this.getSuccessCardContents();
    }
  };

  private getErrorContents = (): JSX.Element => {
    const {
      error,
      mediaName,
      mediaType,
      onRetry,
      actions,
      fileSize,
    } = this.props;

    return (
      <>
        <div className="wrapper" />
        <CardOverlay
          persistent={true}
          mediaName={mediaName}
          mediaType={mediaType}
          error={error}
          onRetry={onRetry}
          actions={actions}
          subtitle={fileSize}
        />
      </>
    );
  };

  private getFailedContents = () => {
    const { mediaName, mediaType, actions, fileSize } = this.props;

    return (
      <>
        <div className="wrapper" />
        <CardOverlay
          noHover={true}
          persistent={true}
          mediaName={mediaName}
          mediaType={mediaType}
          actions={actions}
          subtitle={fileSize}
        />
      </>
    );
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
    const {
      mediaType,
      dataURI,
      disableOverlay,
      previewOrientation,
    } = this.props;
    const overlay =
      this.isDownloadingOrProcessing() || disableOverlay
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
            previewOrientation={previewOrientation}
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
