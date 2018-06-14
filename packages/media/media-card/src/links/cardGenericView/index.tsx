import * as React from 'react';
import { Component } from 'react';
import { CardDimensions, CardAppearance } from '../../index';

import {
  BlockResolvingView,
  BlockResolvedView,
  BlockErroredView,
} from '@atlaskit/smart-card';
import { CardAction } from '../../actions';
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

  render() {
    const { isHorizontal } = this;
    const {
      isLoading,
      linkUrl,
      site,
      iconUrl,
      title,
      description,
      thumbnailUrl,
      appearance,
      errorMessage,
    } = this.props;

    if (errorMessage) {
      return <BlockErroredView message="We stumbled a bit here" />;
    }

    if (isLoading) {
      return <BlockResolvingView />;
    }

    return (
      <BlockResolvedView
        context={{
          text: site || linkUrl || '',
          icon: iconUrl,
        }}
        title={title ? { text: title } : undefined}
        description={description ? { text: description } : undefined}
        preview={!isHorizontal ? thumbnailUrl : undefined}
        thumbnail={isHorizontal ? thumbnailUrl : undefined}
        onClick={() => window.open(linkUrl)}
      />
    );
  }
}

export default LinkCardGenericView;
