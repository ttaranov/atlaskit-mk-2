import * as React from 'react';
import { Component } from 'react';
import * as deepEqual from 'deep-equal';
import {
  Context,
  MediaItemType,
  MediaItemProvider,
  UrlPreviewProvider,
  ImageResizeMode,
  MediaItemDetails,
} from '@atlaskit/media-core';
import { MediaStore } from '@atlaskit/media-store';

import {
  SharedCardProps,
  CardEventProps,
  CardAnalyticsContext,
  CardStatus,
} from '../..';
import { CardView } from '../cardView';
import { LazyContent } from '../../utils/lazyContent';
import { getBaseAnalyticsContext } from '../../utils/analyticsUtils';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { isRetina } from '../../utils/isRetina';
import {
  ElementDimension,
  getElementDimension,
} from '../../utils/getElementDimension';
import {
  getCardMinHeight,
  defaultImageCardDimensions,
} from '../../utils/cardDimensions';
import { isValidPercentageUnit } from '../../utils/isValidPercentageUnit';
import { containsPixelUnit } from '../../utils/containsPixelUnit';

export type Identifier = UrlPreviewIdentifier | LinkIdentifier | FileIdentifier;
export type Provider = MediaItemProvider | UrlPreviewProvider;

export interface FileIdentifier {
  readonly mediaItemType: 'file';
  readonly id: string;
  readonly occurrenceKey?: string;
  readonly collectionName?: string; // files can exist outside of a collection
}

export interface LinkIdentifier {
  readonly mediaItemType: 'link';
  readonly id: string;
  readonly occurrenceKey?: string;
  readonly collectionName: string; // links always exist within a collection
}

export interface UrlPreviewIdentifier {
  readonly mediaItemType: 'link';
  readonly url: string;
}

export interface CardProps extends SharedCardProps, CardEventProps {
  readonly context: Context;
  readonly identifier: Identifier;
  readonly isLazy?: boolean;
  readonly resizeMode?: ImageResizeMode;

  // only relevant to file card with image appearance
  readonly disableOverlay?: boolean;
}

export interface CardState {
  status: CardStatus;
  metadata?: MediaItemDetails;
  dataURI?: string;
}

export class Card extends Component<CardProps, CardState> {
  static defaultProps: Partial<CardProps> = {
    appearance: 'auto',
    resizeMode: 'crop',
    isLazy: true,
    disableOverlay: false,
  };

  constructor(props: CardProps) {
    super(props);
    const { identifier } = props;

    this.subscribe(identifier);
    this.state = {
      status: 'loading',
    };
  }

  componentWillReceiveProps(nextProps: CardProps) {
    const {
      context: currentContext,
      identifier: currentIdentifier,
    } = this.props;
    const { context: nextContext, identifier: nextIdenfifier } = nextProps;

    if (
      currentContext !== nextContext ||
      !deepEqual(currentIdentifier, nextIdenfifier)
    ) {
      this.subscribe(nextIdenfifier);
    }
  }

  componentWillUnmount() {
    // TODO: unsubscribe
    // TODO: revokeObjectUrl
  }

  private isSmall(): boolean {
    return this.props.appearance === 'small';
  }

  // TODO: move method into utility
  dataURIDimension(dimension: ElementDimension): number {
    const retinaFactor = isRetina() ? 2 : 1;
    const dimensionValue =
      (this.props.dimensions && this.props.dimensions[dimension]) || '';

    if (this.isSmall()) {
      return getCardMinHeight('small') * retinaFactor;
    }

    if (isValidPercentageUnit(dimensionValue)) {
      return getElementDimension(this, dimension) * retinaFactor;
    }

    if (typeof dimensionValue === 'number') {
      return dimensionValue * retinaFactor;
    }

    if (containsPixelUnit(`${dimensionValue}`)) {
      return parseInt(`${dimensionValue}`, 10) * retinaFactor;
    }

    return defaultImageCardDimensions[dimension] * retinaFactor;
  }

  subscribe(identifier: Identifier) {
    if (identifier.mediaItemType !== 'file') {
      return;
    }
    const { context } = this.props;
    const { id, collectionName } = identifier;

    context.getFile(id, { collectionName }).subscribe({
      next: async state => {
        if (state.status === 'uploading') {
          // TODO: convert state.preview into string and set as dataURI
        }

        if (state.status === 'processed') {
          const mediaStore = new MediaStore({
            serviceHost: context.config.serviceHost,
            authProvider: context.config.authProvider,
          });
          const width = this.dataURIDimension('width');
          const height = this.dataURIDimension('height');

          // TODO: make options optional
          const blob = await mediaStore.getImage(id, {
            collection: collectionName,
            'max-age': 3600,
            allowAnimated: true,
            height,
            width,
          });
          const dataURI = URL.createObjectURL(blob);

          this.setState({
            dataURI,
            status: 'complete',
            metadata: {
              // TODO: pass missing data (mimeType, mediaType, creationDate, processingStatus)
              id: state.id,
              name: state.name,
              size: state.size,
            },
          });
        }
      },
      error: error => {
        this.setState({
          status: 'error',
        });
      },
    });
  }

  private isUrlPreviewIdentifier(
    identifier: Identifier,
  ): identifier is UrlPreviewIdentifier {
    const preview = identifier as UrlPreviewIdentifier;
    return preview && preview.url !== undefined;
  }

  get placeholder(): JSX.Element {
    const { appearance, dimensions } = this.props;

    return (
      <CardView
        status="loading"
        appearance={appearance}
        dimensions={dimensions}
        mediaItemType={this.mediaItemType}
      />
    );
  }

  get analyticsContext(): CardAnalyticsContext {
    const { identifier } = this.props;
    const id = this.isUrlPreviewIdentifier(identifier)
      ? identifier.url
      : identifier.id;
    return getBaseAnalyticsContext('Card', id);
  }

  render() {
    const {
      isLazy,
      appearance,
      resizeMode,
      dimensions,
      actions,
      selectable,
      selected,
      onClick,
      onMouseEnter,
      onSelectChange,
      onLoadingChange,
      disableOverlay,
    } = this.props;
    const { status, metadata, dataURI } = this.state;
    const { mediaItemType, placeholder, analyticsContext } = this;
    const card = (
      <AnalyticsContext data={analyticsContext}>
        <CardView
          status={status}
          metadata={metadata}
          dataURI={dataURI}
          mediaItemType={mediaItemType}
          appearance={appearance}
          resizeMode={resizeMode}
          dimensions={dimensions}
          actions={actions}
          selectable={selectable}
          selected={selected}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onSelectChange={onSelectChange}
          disableOverlay={disableOverlay}
          onLoadingChange={onLoadingChange} // TODO: Implement here
        />
      </AnalyticsContext>
    );

    return isLazy ? (
      <LazyContent placeholder={placeholder}>{card}</LazyContent>
    ) : (
      card
    );
  }

  private get mediaItemType(): MediaItemType {
    const { mediaItemType } = this.props.identifier;

    return mediaItemType;
  }
}
