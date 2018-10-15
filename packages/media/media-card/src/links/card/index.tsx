import * as React from 'react';
import { Component } from 'react';
import { UrlPreview, ImageResizeMode, Resource } from '@atlaskit/media-core';

import { SharedCardProps, CardStatus, CardAppearance } from '../..';
import { LinkCardGenericView } from '../cardGenericView';
import { CardGenericViewSmall } from '../../utils/cardGenericViewSmall';
import { URLEmbedCard } from '../embed/urlEmbedCard';
import { HTMLEmbedCard } from '../embed/htmlEmbedCard';
import { A } from './styled';

export interface LinkCardProps extends SharedCardProps {
  readonly status: CardStatus;
  readonly details?: UrlPreview;
  readonly resizeMode?: ImageResizeMode;
  readonly onRetry?: () => void;
}

export const defaultLinkCardAppearance: CardAppearance = 'square';

export class LinkCard extends Component<LinkCardProps, {}> {
  render(): JSX.Element | null {
    const {
      resources: { app, player },
    } = this;
    const { appearance } = this.props;

    switch (appearance) {
      case 'small':
        return this.renderSmallCard();

      case 'horizontal':
        return this.renderGenericLink(appearance);

      case 'square':
        return this.renderGenericLink(appearance);

      default:
        if (app && this.isEmbed(app)) {
          return this.renderEmbed(app);
        } else if (player && this.isEmbed(player)) {
          return this.renderEmbed(player);
        } else {
          return this.renderGenericLink(defaultLinkCardAppearance);
        }
    }
  }

  private renderInLink(link: any, child: any): JSX.Element {
    const { isLoading, isError } = this;
    if (link && !isLoading && !isError) {
      return (
        <A linkUrl={link} className="link-wrapper">
          {child}
        </A>
      );
    } else {
      return child;
    }
  }

  private isURLEmbed(embed: Resource): boolean {
    const { type, url, height, aspect_ratio } = embed;

    // we can only embed HTML pages in an iframe
    if (type !== 'text/html') {
      return false;
    }

    // we need a height to know how big to show the iframe, otherwise, for some embeds,
    // we will be cutting off the content, or showing too much whitespace around the content.
    // we don't care as much about the width - most will stretch content to the width, or center content
    return Boolean(url && (height || aspect_ratio));
  }

  private isHTMLEmbed(embed: Resource): boolean {
    const { type, html } = embed;

    // we can only embed HTML pages in an iframe
    if (type !== 'text/html') {
      return false;
    }

    return Boolean(html);
  }

  private isEmbed(embed: Resource): boolean {
    return this.isURLEmbed(embed) || this.isHTMLEmbed(embed);
  }

  private renderURLEmbed(embed: Resource): JSX.Element {
    const { url, width, height, aspect_ratio } = embed;
    return (
      <URLEmbedCard
        url={url || ''}
        width={width}
        height={height}
        aspectRatio={aspect_ratio}
      />
    );
  }

  private renderHTMLEmbed(embed: Resource): JSX.Element {
    const { html } = embed;
    return <HTMLEmbedCard html={html || ''} />;
  }

  private renderEmbed(embed: Resource) {
    if (this.isURLEmbed(embed)) {
      return this.renderURLEmbed(embed);
    }

    if (this.isHTMLEmbed(embed)) {
      return this.renderHTMLEmbed(embed);
    }

    // this case should never occur provided we've called `isEmbed(embed)` before calling this method
    return null;
  }

  private renderGenericLink(appearance: CardAppearance): JSX.Element | null {
    const { url, title, site, description } = this.urlPreview;
    const { onRetry } = this.props;
    const { errorMessage } = this;

    return (
      <LinkCardGenericView
        errorMessage={errorMessage}
        linkUrl={url}
        title={title}
        site={site}
        description={description}
        thumbnailUrl={this.thumbnailUrl}
        iconUrl={this.iconUrl}
        appearance={appearance}
        isLoading={this.isLoading}
        onRetry={onRetry}
      />
    );
  }

  private renderSmallCard(): JSX.Element {
    const { url, title, site } = this.urlPreview;
    const { dimensions, actions, onRetry } = this.props;
    const { iconUrl, thumbnailUrl, isLoading, errorMessage } = this;
    return this.renderInLink(
      url,
      <CardGenericViewSmall
        title={title}
        subtitle={site || url}
        iconUrl={iconUrl}
        thumbnailUrl={thumbnailUrl}
        dimensions={dimensions}
        loading={isLoading}
        actions={actions}
        error={errorMessage}
        type="link"
        mediaType="image"
        onRetry={onRetry}
      />,
    );
  }

  private get resources() {
    const { resources } = this.urlPreview;
    return resources || {};
  }

  private get urlPreview() {
    const defaultUrlPreview: UrlPreview = { type: '', url: '', title: '' };
    const urlPreview = this.props.details;

    // We provide a defaultUrlPreview in order to conform what the card is expecting and show the right loading status
    return urlPreview || defaultUrlPreview;
  }

  private get thumbnailUrl() {
    const { thumbnail, image } = this.resources;
    const imageUrl = image ? image.url : undefined;
    const thumbnailUrl = thumbnail ? thumbnail.url : undefined;

    // TODO: Should we default here to 'this.iconUrl'?
    return imageUrl || thumbnailUrl;
  }

  private get iconUrl() {
    const { icon } = this.resources;

    return icon ? icon.url : undefined;
  }

  private get isLoading(): boolean {
    const { status } = this.props;
    return status === 'loading' || status === 'processing';
  }

  private get isError(): boolean {
    const { status } = this.props;
    return status === 'error';
  }

  private get errorMessage(): string | undefined {
    return this.isError ? 'Loading failed' : undefined;
  }
}

export default LinkCard;
