import * as React from 'react';
import { Component } from 'react';
import { CardDimensions, CardAppearance } from '../../index';

import { BlockResolvedView, BlockErroredView } from '@atlaskit/smart-card';
import { getCardMinWidth, getCardMaxWidth } from '../../utils/cardDimensions';
import { CardAction } from '../../actions';
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
      return <BlockErroredView message="We stumbled a bit here" />;
    }

    return (
      <ResolvedView
        context={{
          text: site || linkUrl,
          icon: this.renderIcon(),
        }}
      />
    );
  }
}

export default LinkCardGenericView;
