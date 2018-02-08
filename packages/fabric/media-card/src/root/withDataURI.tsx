import * as React from 'react';
import {
  DataUriService,
  MediaItemDetails,
  ImageResizeMode,
} from '@atlaskit/media-core';
import { CardAppearance, CardDimensions } from '..';
import { isRetina } from '../utils/isRetina';
import { isLinkDetails } from '../utils/isLinkDetails';
import { isValidPercentageUnit } from '../utils/isValidPercentageUnit';
import { containsPixelUnit } from '../utils/containsPixelUnit';
import { getCardMinHeight } from '../utils/cardDimensions';
import {
  getElementDimension,
  ElementDimension,
} from '../utils/getElementDimension';
import { defaultImageCardDimensions } from '../utils';

export interface WithDataURIProps {
  dataURIService?: DataUriService;
  metadata?: MediaItemDetails;
  appearance?: CardAppearance;
  dimensions?: CardDimensions;
  resizeMode?: ImageResizeMode;

  // allow extra props to be passed down to lower views e.g. status and error to CardView
  [propName: string]: any;
}

export interface WithDataURIState {
  dataURI?: string;
}

export interface WithDataURI
  extends React.Component<WithDataURIProps, WithDataURIState> {
  componentDidMount(): void;
  componentWillReceiveProps(nextProps: WithDataURIProps): void;
}

// return type is "any" to avoid TS attempting to infer the return type
// if TS attempts to infer the return type it can NOT publish .d.ts files because WithDataURIImpl isn't exported
export const withDataURI = (Component): any => {
  // tslint:disable-line:variable-name
  class WithDataURIImpl extends React.Component<
    WithDataURIProps,
    WithDataURIState
  > implements WithDataURI {
    state: WithDataURIState = {};

    private needToFetch(
      prevProps: WithDataURIProps,
      nextProps: WithDataURIProps,
    ) {
      const {
        dataURIService: currentDataURIService,
        metadata: currentMetadata,
      } = prevProps;
      const {
        dataURIService: nextDataURIService,
        metadata: nextMetadata,
      } = nextProps;
      return (
        nextDataURIService !== currentDataURIService ||
        nextMetadata !== currentMetadata
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
      const { dataURIService, metadata, resizeMode, appearance } = this.props;

      // we don't need to fetch the dataURI if we don't have any metadata or if we have a link
      if (!dataURIService || !metadata || isLinkDetails(metadata)) {
        return;
      }

      const width = this.dataURIDimension('width');
      const height = this.dataURIDimension('height');
      const allowAnimated = appearance !== 'small';

      try {
        const dataURI = await dataURIService.fetchImageDataUri(
          { type: 'file', details: metadata },
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

    componentWillReceiveProps(nextProps: WithDataURIProps): void {
      if (this.needToFetch(this.props, nextProps)) {
        this.setState({ dataURI: undefined });
      }
    }

    componentDidUpdate(prevProps: WithDataURIProps) {
      if (this.needToFetch(prevProps, this.props)) {
        this.fetch();
      }
    }

    render(): JSX.Element {
      const { dataURIService, ...otherProps } = this.props;
      const { dataURI } = this.state;
      return <Component {...otherProps} dataURI={dataURI} />;
    }
  }

  return WithDataURIImpl;
};
