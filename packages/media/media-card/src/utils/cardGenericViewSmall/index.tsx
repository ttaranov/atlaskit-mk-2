import * as React from 'react';
import { Component } from 'react';
import * as cx from 'classnames';
import { CardAction, MediaType, MediaItemType } from '@atlaskit/media-core';
import { Menu, ErrorIcon } from '../../utils';
import { MediaTypeIcon } from '../../utils/mediaTypeIcon';
import { CardDimensions } from '../..';
import { InfoView } from './infoView';
import { ThumbnailView } from './thumbnailView';
import {
  ErrorWrapper,
  Error,
  Retry,
  SmallCard,
  ImgWrapper,
  InfoWrapper,
  ActionsWrapper,
} from './styled';

export interface CardGenericViewSmallProps {
  type: MediaItemType;
  dimensions?: CardDimensions;
  title?: string;
  subtitle?: string;
  mediaType?: MediaType;
  iconUrl?: string;
  thumbnailUrl?: string;
  loading?: boolean;
  actions?: Array<CardAction>;
  error?: string;
  onRetry?: () => void;
}

export interface CardGenericViewSmallState {
  isMenuExpanded: boolean;
}

export class CardGenericViewSmall extends Component<
  CardGenericViewSmallProps,
  CardGenericViewSmallState
> {
  state: CardGenericViewSmallState = {
    isMenuExpanded: false,
  };

  render() {
    const { error } = this.props;
    if (error) {
      return this.renderError();
    } else {
      return this.renderCard();
    }
  }

  renderFileCard() {
    const { loading, mediaType, thumbnailUrl, title, subtitle } = this.props;
    return this.formatCard(
      <ThumbnailView type="file" url={thumbnailUrl} isLoading={loading} />,
      <InfoView
        icon={<MediaTypeIcon type={mediaType} />}
        title={title}
        subtitle={subtitle}
        isLink={false}
        isLoading={loading}
      />,
    );
  }

  renderLinkCard() {
    const { loading, iconUrl, thumbnailUrl, title, subtitle } = this.props;
    return this.formatCard(
      <ThumbnailView type="link" url={thumbnailUrl} isLoading={loading} />,
      <InfoView
        icon={iconUrl ? <img src={iconUrl} /> : null}
        title={title}
        subtitle={subtitle}
        isLink={true}
        isLoading={loading}
      />,
    );
  }

  renderCard() {
    const { type } = this.props;
    if (type === 'link') {
      return this.renderLinkCard();
    } else {
      return this.renderFileCard();
    }
  }

  renderError() {
    const { error, onRetry } = this.props;
    const retryComponent = onRetry ? (
      <Retry onClick={onRetry}>Retry</Retry>
    ) : null;

    return this.formatCard(
      <ErrorIcon />,
      <ErrorWrapper>
        <Error className="error">{error}</Error>
        {retryComponent}
      </ErrorWrapper>,
    );
  }

  private formatCard(left: JSX.Element, right: JSX.Element) {
    const { actions, loading, error } = this.props;
    const cardClass = cx('media-card', { loading });

    return (
      <SmallCard hasError={!!error} className={cardClass}>
        <ImgWrapper shadow={!loading && !error}>{left}</ImgWrapper>
        <InfoWrapper>{right}</InfoWrapper>
        <ActionsWrapper>
          <Menu actions={actions} />
        </ActionsWrapper>
      </SmallCard>
    );
  }
}
