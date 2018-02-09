import * as React from 'react';
import { Context, MediaItemType, ImageResizeMode } from '@atlaskit/media-core';
import { CardAppearance, CardDimensions } from '..';
import { isRetina } from '../utils/isRetina';
import { isValidPercentageUnit } from '../utils/isValidPercentageUnit';
import { containsPixelUnit } from '../utils/containsPixelUnit';
import { getCardMinHeight } from '../utils/cardDimensions';
import {
  getElementDimension,
  ElementDimension,
} from '../utils/getElementDimension';
import { defaultImageCardDimensions } from '../utils';

export interface WithMediaItemURIProps {
  context: Context;
  id: string;
  type: MediaItemType;
  children: (dataURI?: string) => React.ReactElement<any>;

  appearance?: CardAppearance;
  dimensions?: CardDimensions;
  resizeMode?: ImageResizeMode;
}

export interface WithMediaItemURIState {
  dataURI?: string;
}

export default class WithMediaItemURI extends React.Component<
  WithMediaItemURIProps,
  WithMediaItemURIState
> {
  state: WithMediaItemURIState = {};

  private needToFetch(
    prevProps: WithMediaItemURIProps,
    nextProps: WithMediaItemURIProps,
  ) {
    const { context: prevContext, type: prevType, id: prevId } = prevProps;
    const { context: nextContext, type: nextType, id: nextId } = nextProps;
    return (
      nextContext !== prevContext || nextType !== prevType || nextId !== prevId
    );
  }

  private isSmall(): boolean {
    return this.props.appearance === 'small';
  }

  // No mather if the integrator passed pixels or percentages, this will
  // always return a pixels value that the /image endpoint can use
  private dataURIDimension(dimension: ElementDimension): number {
    const retinaFactor = isRetina() ? 2 : 1;
    const dimensionValue =
      (this.props.dimensions && this.props.dimensions[dimension]) || '';

    if (this.isSmall()) {
      return getCardMinHeight('small') * retinaFactor;
    }

    if (isValidPercentageUnit(dimensionValue)) {
      return getElementDimension(this, dimension) * retinaFactor;
    }

    if (typeof dimensionValue === 'number') {
      return dimensionValue * retinaFactor;
    }

    if (containsPixelUnit(`${dimensionValue}`)) {
      return parseInt(`${dimensionValue}`, 10) * retinaFactor;
    }

    return defaultImageCardDimensions[dimension] * retinaFactor;
  }

  private async fetch() {
    const { context, type, id, resizeMode, appearance } = this.props;

    // we don't need to fetch the dataURI if its a link
    if (type === 'link') {
      return;
    }

    const width = this.dataURIDimension('width');
    const height = this.dataURIDimension('height');
    const allowAnimated = appearance !== 'small';

    const dataURIService = context.getDataUriService();
    try {
      const dataURI = await dataURIService.fetchImageDataUri(
        { type: 'file', details: { id } },
        {
          width,
          height,
          mode: resizeMode,
          allowAnimated,
        },
      );
      this.setState({ dataURI });
    } catch (error) {
      /* we don't do anything atm */
    }
  }

  componentDidMount(): void {
    this.fetch();
  }

  componentWillReceiveProps(nextProps: WithMediaItemURIProps): void {
    if (this.needToFetch(this.props, nextProps)) {
      this.setState({ dataURI: undefined });
    }
  }

  componentDidUpdate(prevProps: WithMediaItemURIProps) {
    if (this.needToFetch(prevProps, this.props)) {
      this.fetch();
    }
  }

  render() {
    const { children } = this.props;
    const { dataURI } = this.state;
    return children(dataURI);
  }
}
