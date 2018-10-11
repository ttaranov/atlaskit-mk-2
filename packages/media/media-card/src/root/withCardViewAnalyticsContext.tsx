import * as React from 'react';

import { FileDetails, MediaItemType, UrlPreview } from '@atlaskit/media-core';

import { AnalyticsContext } from '@atlaskit/analytics-next';

import { shouldDisplayImageThumbnail } from '../utils/shouldDisplayImageThumbnail';
import { getBaseAnalyticsContext } from '../utils/analyticsUtils';
import { isLinkDetails } from '../utils/isLinkDetails';

import { CardViewOwnProps } from './cardView';
import {
  CardViewAnalyticsContext,
  AnalyticsLinkAttributes,
  AnalyticsFileAttributes,
  CardStatus,
} from '../index';

const mapStatusToAnalyticsLoadStatus = (status: CardStatus) => {
  if (status === 'error' || status === 'failed-processing') {
    return 'fail';
  } else if (status === 'loading' || status === 'processing') {
    return 'loading_metadata';
  } else {
    return status;
  }
};

export type WithCardViewAnalyticsContextProps = CardViewOwnProps & {
  readonly mediaItemType: MediaItemType;
};

export class WithCardViewAnalyticsContext extends React.Component<
  WithCardViewAnalyticsContextProps
> {
  private getBaseAnalyticsContext(): CardViewAnalyticsContext {
    const mediaItemType = this.props.mediaItemType;
    const { status, appearance, actions } = this.props;
    const loadStatus = mapStatusToAnalyticsLoadStatus(status);
    const hasActionMenuItems = !!(actions && actions.length > 0);

    return {
      ...getBaseAnalyticsContext('CardView', null),
      type: mediaItemType,
      loadStatus,
      viewAttributes: {
        viewPreview: false,
        viewSize: appearance,
        viewActionmenu: hasActionMenuItems,
      },
    };
  }

  private getLinkCardAnalyticsContext(
    metadata: UrlPreview,
  ): CardViewAnalyticsContext {
    const analyticsContext = this.getBaseAnalyticsContext();

    const dummyHrefElement = document.createElement('a');
    dummyHrefElement.href = metadata.url;
    const hostname = dummyHrefElement.hostname;

    analyticsContext.actionSubjectId = metadata.url;
    analyticsContext.viewAttributes.viewPreview = !!(
      metadata.resources &&
      (metadata.resources.thumbnail || metadata.resources.image)
    );

    const linkAttributes: AnalyticsLinkAttributes = {
      linkDomain: hostname,
    };

    return {
      ...analyticsContext,
      linkAttributes,
    };
  }

  private getFileCardAnalyticsContext(metadata: FileDetails) {
    const { dataURI } = this.props;
    const analyticsContext = this.getBaseAnalyticsContext();

    analyticsContext.actionSubjectId = metadata.id;
    analyticsContext.viewAttributes.viewPreview = shouldDisplayImageThumbnail(
      dataURI,
      metadata.mediaType,
    );
    const fileAttributes: AnalyticsFileAttributes = {
      fileMediatype: metadata.mediaType,
      fileSize: metadata.size,
      fileStatus: metadata.processingStatus,
      fileMimetype: metadata.mimeType,
    };
    return {
      ...analyticsContext,
      fileAttributes,
    };
  }

  private get analyticsContext(): CardViewAnalyticsContext {
    if (this.props.metadata) {
      const metadata = this.props.metadata;
      if (isLinkDetails(metadata)) {
        return this.getLinkCardAnalyticsContext(metadata);
      } else {
        return this.getFileCardAnalyticsContext(metadata);
      }
    } else {
      return this.getBaseAnalyticsContext();
    }
  }

  render() {
    return (
      <AnalyticsContext data={this.analyticsContext}>
        {this.props.children}
      </AnalyticsContext>
    );
  }
}
