import * as React from 'react';
import { Context, ImageResizeMode, FileDetails } from '@atlaskit/media-core';
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

export interface RenderProps {
  src?: string;
}

export interface WithFileImageProps {
  context: Context;
  details?: FileDetails;
  appearance?: CardAppearance;
  dimensions?: CardDimensions;
  resizeMode?: ImageResizeMode;
  children: (props: RenderProps) => React.ReactElement<any>;
}

export interface WithFileImageState {
  src?: string;
}

export default class WithFileImage extends React.Component<
  WithFileImageProps,
  WithFileImageState
> {
  state: WithFileImageState = {};

  private needToFetch(
    prevProps: WithFileImageProps,
    nextProps: WithFileImageProps,
  ) {
    const { context: prevContext, details: prevDetails } = prevProps;
    const { context: nextContext, details: nextDetails } = nextProps;
    return nextContext !== prevContext || nextDetails !== prevDetails;
  }

  private hasImage(): boolean {
    const { details } = this.props;

    if (!details || !details.artifacts) {
      return false;
    }

    // const {artifacts} = details;
    // if (!artifacts['image.jpg']) {
    //   return false;
    // }

    return true;
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
    const { context, details, resizeMode, appearance } = this.props;

    // check if we have metadata to fetch
    if (!details) {
      return;
    }

    // check if the server will return an image
    if (!this.hasImage()) {
      return;
    }

    const width = this.dataURIDimension('width');
    const height = this.dataURIDimension('height');
    const allowAnimated = appearance !== 'small';

    const dataURIService = context.getDataUriService();
    try {
      const src = await dataURIService.fetchImageDataUri(
        { type: 'file', details },
        {
          width,
          height,
          mode: resizeMode,
          allowAnimated,
        },
      );
      this.setState({ src });
    } catch (error) {
      /* we don't do anything atm */
    }
  }

  componentDidMount(): void {
    this.fetch();
  }

  componentWillReceiveProps(nextProps: WithFileImageProps): void {
    if (this.needToFetch(this.props, nextProps)) {
      this.setState({ src: undefined });
    }
  }

  componentDidUpdate(prevProps: WithFileImageProps) {
    if (this.needToFetch(prevProps, this.props)) {
      this.fetch();
    }
  }

  render() {
    const { children } = this.props;
    const { src } = this.state;
    return children({ src });
  }
}
