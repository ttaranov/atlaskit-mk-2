import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MouseEvent } from 'react';
import {
  MediaItemType,
  MediaItemDetails,
  LinkDetails,
  FileDetails,
  UrlPreview,
  ImageResizeMode,
} from '@atlaskit/media-core';

import {
  SharedCardProps,
  CardStatus,
  CardEvent,
  OnSelectChangeFuncResult,
  CardDimensionValue,
} from '..';
import { LinkCard } from '../links';
import { FileCard } from '../files';
import { isLinkDetails } from '../utils/isLinkDetails';
import {
  breakpointSize,
  BreakpointSizeValue,
  cardBreakpointSizes,
} from '../utils/breakpoint';
import { defaultImageCardDimensions } from '../utils/cardDimensions';
import { isValidPercentageUnit } from '../utils/isValidPercentageUnit';
import { getCSSUnitValue } from '../utils/getCSSUnitValue';
import { getElementDimension } from '../utils/getElementDimension';
import { Wrapper } from './styled';

export interface CardViewProps extends SharedCardProps {
  readonly status: CardStatus;
  readonly mediaItemType?: MediaItemType;
  readonly metadata?: MediaItemDetails;
  readonly resizeMode?: ImageResizeMode;

  readonly onRetry?: () => void;
  readonly onClick?: (result: CardEvent) => void;
  readonly onMouseEnter?: (result: CardEvent) => void;
  readonly onSelectChange?: (result: OnSelectChangeFuncResult) => void;

  // allow extra props to be passed down to lower views e.g. dataURI to FileCard
  [propName: string]: any;
}

export interface CardViewState {
  elementWidth?: number;
}

export class CardView extends React.Component<CardViewProps, CardViewState> {
  // tslint:disable-line:variable-name
  static defaultProps = {
    appearance: 'auto',
  };

  state: CardViewState = {};

  componentDidMount() {
    this.saveElementWidth();
  }

  componentWillReceiveProps(nextProps: CardViewProps) {
    const { selected: currSelected } = this.props;
    const { selectable: nextSelectable, selected: nextSelected } = nextProps;

    // need to coerce to booleans as both "undefined" and "false" are considered NOT selected
    const cs: boolean = !!currSelected;
    const ns: boolean = !!nextSelected;

    if (nextSelectable && cs !== ns) {
      this.fireOnSelectChangeToConsumer(ns);
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

  private get cardSize(): BreakpointSizeValue {
    return breakpointSize(this.width, cardBreakpointSizes);
  }

  // If the dimensions.width is a percentage, we need to transform it
  // into a pixel value in order to get the right breakpoints applied.
  saveElementWidth() {
    const { dimensions } = this.props;
    if (!dimensions) {
      return;
    }

    const element = ReactDOM.findDOMNode(this);
    const { width } = dimensions;

    if (width && isValidPercentageUnit(width)) {
      const elementWidth = getElementDimension(element, 'width');

      this.setState({ elementWidth });
    }
  }

  render() {
    const { onClick, onMouseEnter } = this;
    const { mediaItemType, dimensions, appearance } = this.props;
    let card;

    if (mediaItemType === 'link') {
      card = this.renderLink();
    } else if (mediaItemType === 'file') {
      card = this.renderFile();
    } else {
      card = this.renderCardFromDetails();
    }

    return (
      <Wrapper
        cardSize={this.cardSize}
        appearance={appearance}
        dimensions={dimensions}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        {card}
      </Wrapper>
    );
  }

  private renderCardFromDetails = () => {
    const { metadata } = this.props;

    if (isLinkDetails(metadata)) {
      return this.renderLink();
    }

    return this.renderFile();
  };

  private renderLink = () => {
    const {
      mediaItemType,
      status,
      metadata,
      onClick,
      onMouseEnter,
      onSelectChange,
      onRetry,
      ...otherProps,
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
      ...otherProps,
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
    if (onClick) {
      onClick({ event, mediaItemDetails });
    }
  };

  private onMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    const { onMouseEnter, metadata: mediaItemDetails } = this.props;
    if (onMouseEnter) {
      onMouseEnter({ event, mediaItemDetails });
    }
  };
}
