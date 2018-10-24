import * as React from 'react';
import { Component } from 'react';
import { CardAppearance } from '../../index';

import {
  BlockCardErroredView,
  BlockCardResolvingView,
  BlockCardResolvedView,
} from '@atlaskit/media-ui';
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

  handleClick = () => {
    window.open(this.props.linkUrl);
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
        <BlockCardErroredView
          url={linkUrl || ''}
          message="We stumbled a bit here"
          onClick={this.handleClick}
          onRetry={onRetry}
        />
      );
    }

    if (isLoading) {
      return <BlockCardResolvingView onClick={this.handleClick} />;
    }

    const isSquare = appearance === 'square';

    return (
      <BlockCardResolvedView
        context={{
          text: site || linkUrl || '',
          icon: iconUrl,
        }}
        title={title ? { text: title } : undefined}
        description={description ? { text: description } : undefined}
        preview={isSquare ? thumbnailUrl : undefined}
        thumbnail={!isSquare ? thumbnailUrl : undefined}
        onClick={this.handleClick}
      />
    );
  }
}

export default LinkCardGenericView;
