import * as React from 'react';
import { MouseEvent } from 'react';
import {
  MediaItemType,
  MediaItemDetails,
  LinkDetails,
  FileDetails,
  UrlPreview,
  ImageResizeMode,
} from '@atlaskit/media-core';
import { version } from '../../package.json';
import {
  SharedCardProps,
  CardStatus,
  CardEvent,
  OnSelectChangeFuncResult,
  CardDimensionValue,
  CardViewAnalyticsContext,
  AnalyticsLinkAttributes,
  AnalyticsFileAttributes,
} from '..';
import { LinkCard } from '../links';
import { FileCard } from '../files';
import { isLinkDetails } from '../utils/isLinkDetails';
import { breakpointSize } from '../utils/breakpoint';
import {
  defaultImageCardDimensions,
  getDefaultCardDimensions,
} from '../utils/cardDimensions';
import { isValidPercentageUnit } from '../utils/isValidPercentageUnit';
import { getCSSUnitValue } from '../utils/getCSSUnitValue';
import { getElementDimension } from '../utils/getElementDimension';
import { Wrapper } from './styled';
import {
  AnalyticsContext,
  withAnalyticsEvents,
  WithCreateAnalyticsEventProps,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { shouldDisplayImageThumbnail } from '../utils/shouldDisplayImageThumnail';

export interface CardViewOwnProps extends SharedCardProps {
  readonly status: CardStatus;
  readonly mediaItemType?: MediaItemType;
  readonly metadata?: MediaItemDetails;
  readonly resizeMode?: ImageResizeMode;

  readonly onRetry?: () => void;
  readonly onClick?: (
    result: CardEvent,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  readonly onMouseEnter?: (result: CardEvent) => void;
  readonly onSelectChange?: (result: OnSelectChangeFuncResult) => void;

  // FileCardProps
  readonly dataURI?: string;
  readonly progress?: number;

  // LinkCardProps
  readonly details?: FileDetails | UrlPreview;
}

export interface CardViewState {
  hasBeenShown: boolean;
  componentHasMountedAtTime: number;
  elementWidth?: number;
}

export type CardViewBaseProps = CardViewOwnProps &
  WithCreateAnalyticsEventProps & {
    readonly mediaItemType: MediaItemType;
  };

export class CardViewBase extends React.Component<
  CardViewBaseProps,
  CardViewState
> {
  state: CardViewState = {
    hasBeenShown: false,
    componentHasMountedAtTime: 0,
  };

  componentWillMount() {
    this.setState({ componentHasMountedAtTime: Date.now() });
  }

  componentDidMount() {
    this.saveElementWidth();
  }

  componentWillReceiveProps(nextProps: CardViewBaseProps) {
    const { selected: currSelected } = this.props;
    const { selectable: nextSelectable, selected: nextSelected } = nextProps;

    // need to coerce to booleans as both "undefined" and "false" are considered NOT selected
    const cs: boolean = !!currSelected;
    const ns: boolean = !!nextSelected;

    if (nextSelectable && cs !== ns) {
      this.fireOnSelectChangeToConsumer(ns);
    }

    if (
      !this.state.hasBeenShown &&
      (nextProps.status === 'error' || nextProps.status === 'complete')
    ) {
      const loadTime = Date.now() - this.state.componentHasMountedAtTime;
      this.props
        .createAnalyticsEvent({ action: 'shown', loadTime })
        .fire('media');
      this.setState({ hasBeenShown: true });
    }
  }

  private fireOnSelectChangeToConsumer = (newSelectedState: boolean): void => {
    const { metadata, selectable, onSelectChange } = this.props;

    if (selectable && onSelectChange) {
      onSelectChange({
        selected: newSelectedState,
        mediaItemDetails: metadata,
      });
    }
  };

  // This width is only used to calculate breakpoints, dimensions are passed down as
  // integrator pass it to the root component
  private get width(): CardDimensionValue {
    const { elementWidth } = this.state;
    if (elementWidth) {
      return elementWidth;
    }

    const { width } = this.props.dimensions || { width: undefined };

    if (!width) {
      return defaultImageCardDimensions.width;
    }

    return getCSSUnitValue(width);
  }

  // If the dimensions.width is a percentage, we need to transform it
  // into a pixel value in order to get the right breakpoints applied.
  saveElementWidth() {
    const { dimensions } = this.props;
    if (!dimensions) {
      return;
    }

    const { width } = dimensions;

    if (width && isValidPercentageUnit(width)) {
      const elementWidth = getElementDimension(this, 'width');

      this.setState({ elementWidth });
    }
  }

  render() {
    const { onClick, onMouseEnter } = this;
    const { dimensions, appearance, mediaItemType } = this.props;
    const wrapperDimensions = dimensions
      ? dimensions
      : mediaItemType === 'file'
        ? getDefaultCardDimensions(appearance)
        : undefined;
    let card;

    if (mediaItemType === 'link') {
      card = this.renderLink();
    } else if (mediaItemType === 'file') {
      card = this.renderFile();
    }

    return (
      <Wrapper
        mediaItemType={mediaItemType}
        breakpointSize={breakpointSize(this.width)}
        appearance={appearance}
        dimensions={wrapperDimensions}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        {card}
      </Wrapper>
    );
  }

  private renderLink = () => {
    const {
      mediaItemType,
      status,
      metadata,
      onClick,
      onMouseEnter,
      onSelectChange,
      onRetry,
      ...otherProps
    } = this.props;

    return (
      <LinkCard
        {...otherProps}
        onRetry={onRetry}
        status={status}
        details={metadata as LinkDetails | UrlPreview}
      />
    );
  };

  private renderFile = () => {
    const {
      mediaItemType,
      status,
      metadata,
      onClick,
      onMouseEnter,
      onSelectChange,
      ...otherProps
    } = this.props;

    return (
      <FileCard
        {...otherProps}
        status={status}
        details={metadata as FileDetails}
      />
    );
  };

  private onClick = (event: MouseEvent<HTMLDivElement>) => {
    const { onClick, metadata: mediaItemDetails } = this.props;
    const analyticsEvent = this.props.createAnalyticsEvent({
      action: 'clicked',
    });
    analyticsEvent.clone().fire('media');
    if (onClick) {
      onClick({ event, mediaItemDetails }, analyticsEvent);
    }
  };

  private onMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    const { onMouseEnter, metadata: mediaItemDetails } = this.props;
    if (onMouseEnter) {
      onMouseEnter({ event, mediaItemDetails });
    }
  };
}

export const CardViewWithAnalyticsEvents = withAnalyticsEvents()(CardViewBase);

const mapStatusToAnalyticsLoadStatus = (status: CardStatus) => {
  if (status === 'error') {
    return 'fail';
  } else if (status === 'loading' || status === 'processing') {
    return 'loading_metadata';
  } else {
    return status;
  }
};

const dummyHrefElement = document.createElement('a');

export class CardView extends React.Component<CardViewOwnProps, CardViewState> {
  static defaultProps: Partial<CardViewOwnProps> = {
    appearance: 'auto',
  };

  private get mediaItemType(): MediaItemType {
    const { mediaItemType, metadata } = this.props;
    if (mediaItemType) {
      return mediaItemType;
    }

    return isLinkDetails(metadata) ? 'link' : 'file';
  }

  private getBaseAnalyticsContext(): CardViewAnalyticsContext {
    const mediaItemType = this.mediaItemType;
    const { status, appearance, actions } = this.props;
    const loadStatus = mapStatusToAnalyticsLoadStatus(status);
    const hasActionMenuItems = !!(actions && actions.length > 0);

    return {
      packageVersion: version,
      packageName: '@atlaskit/media-card',
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
    const mediaItemType = this.mediaItemType;

    return (
      <AnalyticsContext data={this.analyticsContext}>
        <CardViewWithAnalyticsEvents
          {...this.props}
          mediaItemType={mediaItemType}
        />
      </AnalyticsContext>
    );
  }
}
