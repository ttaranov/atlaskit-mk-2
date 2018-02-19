import * as React from 'react';
import { Component } from 'react';
import * as deepEqual from 'deep-equal';
import {
  Context,
  MediaItemType,
  MediaItemProvider,
  UrlPreviewProvider,
  DataUriService,
  ImageResizeMode,
} from '@atlaskit/media-core';

import { SharedCardProps, CardEventProps } from '../..';
import WithPreviewDetails from '../../WithPreviewDetails';
import WithItemDetails from '../../WithItemDetails';
import WithFileImage from '../../WithFileImage';
import { CardView } from '../cardView';
import { LazyContent } from '../../utils/lazyContent';

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
  isLazy?: boolean;
  resizeMode?: ImageResizeMode;
}

export class Card extends Component<CardProps, {}> {
  static defaultProps = {
    appearance: 'auto',
    isLazy: true,
    resizeMode: 'crop',
  };

  private provider: Provider;
  private dataURIService?: DataUriService;

  constructor(props) {
    super(props);
    const { context, identifier } = props;

    this.updateProvider(context, identifier);
    this.updateDataUriService(context, identifier);
  }

  componentWillReceiveProps(nextProps) {
    const {
      context: currentContext,
      identifier: currentIdentifier,
    } = this.props;
    const { context: nextContext, identifier: nextIdenfifier } = nextProps;

    if (
      currentContext !== nextContext ||
      !deepEqual(currentIdentifier, nextIdenfifier)
    ) {
      this.updateProvider(nextContext, nextIdenfifier);
      this.updateDataUriService(nextContext, nextIdenfifier);
    }
  }

  isFileIdentifier(identifier: Identifier): identifier is FileIdentifier {
    return (
      identifier.mediaItemType === 'file' &&
      (identifier as FileIdentifier).id !== undefined
    );
  }

  isLinkIdentifier(identifier: Identifier): identifier is LinkIdentifier {
    return (
      identifier.mediaItemType === 'link' &&
      (identifier as LinkIdentifier).id !== undefined
    );
  }

  private isUrlPreviewIdentifier(
    identifier: Identifier,
  ): identifier is UrlPreviewIdentifier {
    const preview = identifier as UrlPreviewIdentifier;
    return preview && preview.url !== undefined;
  }

  private updateProvider(context: Context, identifier: Identifier): void {
    if (this.isUrlPreviewIdentifier(identifier)) {
      this.provider = context.getUrlPreviewProvider(identifier.url);
    } else {
      const { id, mediaItemType, collectionName } = identifier;
      this.provider = context.getMediaItemProvider(
        id,
        mediaItemType,
        collectionName,
      );
    }
  }

  private updateDataUriService(context: Context, identifier: Identifier): void {
    if (!this.isUrlPreviewIdentifier(identifier)) {
      this.dataURIService = context.getDataUriService(
        identifier.collectionName,
      );
    } else {
      this.dataURIService = undefined;
    }
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

  renderCard(): JSX.Element {
    const { context, identifier, appearance, resizeMode } = this.props;

    const commonProps = {
      resizeMode: resizeMode,
      appearance: appearance,
      mediaItemType: this.mediaItemType,
    };

    if (this.isFileIdentifier(identifier)) {
      const { mediaItemType, id, collectionName } = identifier;
      return (
        <WithItemDetails
          context={context}
          type={mediaItemType}
          id={id}
          collection={collectionName}
        >
          {({ status, details }) => (
            <WithFileImage
              context={context}
              details={details}
              appearance={appearance}
              resizeMode={resizeMode}
            >
              {({ src }) => (
                <CardView
                  {...commonProps}
                  status={status}
                  metadata={details}
                  dataURI={src}
                />
              )}
            </WithFileImage>
          )}
        </WithItemDetails>
      );
    }

    if (this.isLinkIdentifier(identifier)) {
      const { mediaItemType, id, collectionName } = identifier;
      return (
        <WithItemDetails
          context={context}
          type={mediaItemType}
          id={id}
          collection={collectionName}
        >
          {({ status, details }) => (
            <CardView {...commonProps} status={status} metadata={details} />
          )}
        </WithItemDetails>
      );
    }

    if (this.isUrlPreviewIdentifier(identifier)) {
      const { url } = identifier;
      return (
        <WithPreviewDetails context={context} url={url}>
          {({ status, details }) => (
            <CardView {...commonProps} status={status} metadata={details} />
          )}
        </WithPreviewDetails>
      );
    }

    // this case should never occur but is necessary to make typescript happy
    throw new Error('Unsupported identifier');
  }

  render() {
    const { isLazy } = this.props;
    return isLazy ? (
      <LazyContent placeholder={this.placeholder}>
        {this.renderCard()}
      </LazyContent>
    ) : (
      this.renderCard()
    );
  }

  private get mediaItemType(): MediaItemType {
    const { mediaItemType } = this.props.identifier;

    return mediaItemType;
  }
}
