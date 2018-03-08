/**
 * This is actually the Class that contains the View logic.
 * Overlay, Content, dimensions logic lives here.
 */
import * as React from 'react';
import { Component } from 'react';
import {
  MediaType,
  MediaItemType,
  ImageResizeMode,
} from '@atlaskit/media-core';

import { CardDimensions, CardStatus } from '../../index';
import { CardContent } from './cardContent';
import { CardOverlay } from './cardOverlay';
import { Wrapper } from './styled';
import { UploadingView } from '../../utils/uploadingView';
import { CardAction } from '../../actions';

export interface CardImageViewProps {
  mediaItemType?: MediaItemType;
  mediaName?: string;
  mediaType?: MediaType;
  subtitle?: string;

  dataURI?: string;
  progress?: number;
  status?: CardStatus;

  dimensions?: CardDimensions;

  selectable?: boolean;
  selected?: boolean;

  error?: string;
  icon?: string;

  actions?: Array<CardAction>;
  onRetry?: () => void;
  resizeMode?: ImageResizeMode;
}

export class CardImageView extends Component<CardImageViewProps, {}> {
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
      icon,
      subtitle,
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
        icon={icon}
        subtitle={subtitle}
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
    const { mediaType, mediaItemType, dataURI } = this.props;
    const overlay = this.isDownloadingOrProcessing()
      ? null
      : this.createSuccessCardOverlay();

    return (
      <div className="wrapper">
        <div className="img-wrapper">
          <CardContent
            loading={this.isDownloadingOrProcessing()}
            mediaItemType={mediaItemType}
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
      subtitle,
      dataURI,
      selectable,
      selected,
      actions,
      icon,
    } = this.props;
    const isPersistent = mediaType === 'doc' || !dataURI;

    return (
      <CardOverlay
        persistent={isPersistent}
        selectable={selectable}
        selected={selected}
        mediaName={mediaName}
        mediaType={mediaType}
        subtitle={subtitle}
        actions={actions}
        icon={icon}
      />
    );
  };

  get isCropped() {
    const { resizeMode } = this.props;

    return resizeMode === 'crop';
  }
}

export default CardImageView;
