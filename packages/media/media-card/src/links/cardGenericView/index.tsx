import * as React from 'react';
import { Component } from 'react';
import { CardAppearance } from '../../index';

import {
  BlockResolvingView,
  BlockResolvedView,
  BlockErroredView,
} from '@atlaskit/smart-card';
import { defaultLinkCardAppearance } from '../card';

export interface LinkCardGenericViewProps {
  linkUrl?: string;
  title?: string;
  site?: string;
  description?: string;
  thumbnailUrl?: string;
  iconUrl?: string;

  appearance?: CardAppearance;

  isLoading?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export class LinkCardGenericView extends Component<LinkCardGenericViewProps> {
  static defaultProps = {
    title: '',
    description: '',
    actions: [],
    appearance: defaultLinkCardAppearance,
  };

  render() {
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
      onRetry,
    } = this.props;

    if (errorMessage) {
      return (
        <BlockErroredView message="We stumbled a bit here" onRetry={onRetry} />
      );
    }

    if (isLoading) {
      return <BlockResolvingView />;
    }

    const isHorizontal = appearance === 'horizontal';

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
