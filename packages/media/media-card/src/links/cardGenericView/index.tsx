import * as React from 'react';
import { Component } from 'react';
import { CardAction } from '@atlaskit/media-core';
import { CardDimensions, CardAppearance } from '../../index';

import ErrorCard from '../../shared/ErrorCard';
import CardFrame from '../../shared/CardFrame';
import CardPreview from '../../shared/CardPreview';
import LinkIcon from '../../shared/LinkIcon';
import { getCardMinWidth, getCardMaxWidth } from '../../utils/cardDimensions';
import CardDetails from './CardDetails';
import { defaultLinkCardAppearance } from '../card';

export interface LinkCardGenericViewProps {
  linkUrl?: string;
  title?: string;
  site?: string;
  description?: string;
  thumbnailUrl?: string;
  iconUrl?: string;

  appearance?: CardAppearance;
  dimensions?: CardDimensions;

  isLoading?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  actions?: Array<CardAction>;
}

export class LinkCardGenericView extends Component<LinkCardGenericViewProps> {
  static defaultProps = {
    title: '',
    description: '',
    actions: [],
    appearance: defaultLinkCardAppearance,
  };

  private get isHorizontal() {
    const { appearance } = this.props;
    return appearance === 'horizontal';
  }

  private renderIcon() {
    const { iconUrl, isLoading } = this.props;

    if (isLoading) {
      return undefined;
    }

    return <LinkIcon src={iconUrl} />;
  }

  renderPreview() {
    const { isHorizontal } = this;
    const { isLoading, thumbnailUrl } = this.props;

    if (isHorizontal) {
      return null;
    }

    return (
      <CardPreview
        key="preview"
        isPlaceholder={isLoading}
        url={thumbnailUrl || ''}
      />
    );
  }

  renderDetails() {
    const { isHorizontal } = this;
    const { isLoading, title, description, thumbnailUrl } = this.props;
    return (
      <CardDetails
        isPlaceholder={isLoading}
        isThumbnailVisible={isHorizontal}
        title={title}
        description={description}
        thumbnail={isHorizontal ? thumbnailUrl : undefined}
      />
    );
  }

  render() {
    const { isLoading, site, linkUrl, appearance, errorMessage } = this.props;

    if (errorMessage) {
      return (
        <ErrorCard
          hasPreview={appearance !== 'horizontal'}
          minWidth={getCardMinWidth(appearance)}
          maxWidth={getCardMaxWidth(appearance)}
        />
      );
    }

    return (
      <CardFrame
        isPlaceholder={isLoading}
        href={linkUrl}
        icon={this.renderIcon()}
        text={site || linkUrl}
        minWidth={getCardMinWidth(appearance)}
        maxWidth={getCardMaxWidth(appearance)}
      >
        {this.renderPreview()}
        {this.renderDetails()}
      </CardFrame>
    );
  }
}

export default LinkCardGenericView;
