import * as React from 'react';
import { Component } from 'react';
import ImageLoader from 'react-render-image';
import { CardAction } from '@atlaskit/media-core';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import LinkIcon from '@atlaskit/icon/glyph/link';
import Button from '@atlaskit/button';
import { CardDimensions, CardAppearance } from '../../index';

import CardFrame from '../../shared/CardFrame';
import CardPreview from '../../shared/CardPreview';
import IconImage from '../../shared/IconImage';
import { getCardMinWidth, getCardMaxWidth } from '../../utils/cardDimensions';
import CardDetails from './CardDetails';
import {
  ErrorContainer,
  WarningIconWrapper,
  ErrorMessage,
  ErrorImage,
  ErrorWrapper,
} from './styled';
import { linkErrorIcon } from './icons';
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

export const DefaultIcon = () => <LinkIcon label="icon" size="small" />;

export const ErrorIcon = () => (
  <WarningIconWrapper>
    <WarningIcon label="error" size="small" />
  </WarningIconWrapper>
);

export const CustomIcon = ({ url, alt }: { url: string; alt: string }) => (
  <IconImage src={url} alt={alt} />
);

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

  private get siteName() {
    const { site, linkUrl, errorMessage } = this.props;

    if (errorMessage) {
      return null;
    }

    return site || linkUrl;
  }

  private renderIcon() {
    const { iconUrl, title, isLoading, errorMessage } = this.props;

    if (isLoading) {
      return undefined;
    }

    if (!iconUrl) {
      return <DefaultIcon />;
    }

    if (errorMessage) {
      return <ErrorIcon />;
    }

    return (
      <ImageLoader src={iconUrl}>
        {({ loaded, errored }) => {
          if (loaded) {
            return <CustomIcon url={iconUrl || ''} alt={title || ''} />;
          }

          return <DefaultIcon />;
        }}
      </ImageLoader>
    );
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

  renderError() {
    const { isHorizontal } = this;
    const { appearance, onRetry } = this.props;
    const retryButton = onRetry ? (
      <Button onClick={onRetry}>Try again</Button>
    ) : null;

    return (
      <ErrorWrapper appearance={appearance}>
        <ErrorContainer appearance={appearance}>
          {isHorizontal ? null : <ErrorImage src={linkErrorIcon} alt="Error" />}
          <ErrorMessage appearance={appearance}>
            We stumbled a bit here.
          </ErrorMessage>
          {retryButton}
        </ErrorContainer>
      </ErrorWrapper>
    );
  }

  render() {
    const { isLoading, linkUrl, appearance, errorMessage } = this.props;
    return (
      <CardFrame
        isPlaceholder={isLoading}
        href={errorMessage ? undefined : linkUrl}
        icon={this.renderIcon()}
        text={this.siteName}
        minWidth={getCardMinWidth(appearance)}
        maxWidth={getCardMaxWidth(appearance)}
      >
        {errorMessage && this.renderError()}
        {!errorMessage && this.renderPreview()}
        {!errorMessage && this.renderDetails()}
      </CardFrame>
    );
  }
}

export default LinkCardGenericView;
