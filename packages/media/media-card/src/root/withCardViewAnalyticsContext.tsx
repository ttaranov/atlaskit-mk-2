import * as React from 'react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { version, name } from '../../package.json';
import { isLinkDetails } from '../utils/isLinkDetails';

import { shouldDisplayImageThumbnail } from '../utils/shouldDisplayImageThumbnail';
import { CardViewOwnProps } from './cardView';
import {
  CardViewAnalyticsContext,
  AnalyticsLinkAttributes,
  AnalyticsFileAttributes,
  CardStatus,
} from '../index';
import {
  FileDetails,
  MediaItemType,
  UrlPreview,
} from '../../../media-core/src/item';

const mapStatusToAnalyticsLoadStatus = (status: CardStatus) => {
  if (status === 'error') {
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
      packageVersion: version,
      packageName: name,
      componentName: 'CardView',
      actionSubject: 'MediaCard',
      actionSubjectId: null,
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

    if (metadata.id) {
      analyticsContext.actionSubjectId = metadata.id;
    }
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
