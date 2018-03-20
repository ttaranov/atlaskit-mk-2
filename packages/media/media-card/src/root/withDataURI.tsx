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
  readonly dataURIService?: DataUriService;
  readonly metadata?: MediaItemDetails;
  readonly appearance?: CardAppearance;
  readonly dimensions?: CardDimensions;
  readonly resizeMode?: ImageResizeMode;
  readonly preview?: string;
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
  updateDataURI(props: WithDataURIProps): void;
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

    componentDidMount(): void {
      this.updateDataURI(this.props);
    }

    componentWillReceiveProps(nextProps: WithDataURIProps): void {
      const {
        dataURIService: currentDataURIService,
        metadata: currentMetadata,
      } = this.props;
      const {
        dataURIService: nextDataURIService,
        metadata: nextMetadata,
      } = nextProps;

      if (
        nextDataURIService !== currentDataURIService ||
        nextMetadata !== currentMetadata
      ) {
        this.updateDataURI(nextProps);
      }
    }

    private isSmall(): boolean {
      return this.props.appearance === 'small';
    }

    // No mather if the integrator passed pixels or percentages, this will
    // always return a pixels value that the /image endpoint can use
    dataURIDimension(dimension: ElementDimension): number {
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

    setDataURI = dataURI => this.setState({ dataURI });
    clearDataURI = () => this.setState({ dataURI: undefined });

    updateDataURI(props: WithDataURIProps): void {
      const { dataURIService, metadata, resizeMode, appearance } = props;
      const { setDataURI, clearDataURI } = this;

      // clear the dataURI if we're updating to undefined metadata or we're updating to a link
      if (!dataURIService || !metadata || isLinkDetails(metadata)) {
        this.clearDataURI();
        return;
      }

      const width = this.dataURIDimension('width');
      const height = this.dataURIDimension('height');
      const allowAnimated = appearance !== 'small';

      dataURIService
        .fetchImageDataUri(
          { type: 'file', details: metadata },
          {
            width,
            height,
            mode: resizeMode,
            allowAnimated,
          },
        )
        .then(setDataURI, clearDataURI);
    }

    render(): JSX.Element {
      const { dataURIService, ...otherProps } = this.props;
      const dataURI = this.state.dataURI || this.props.preview;

      return <Component {...otherProps} dataURI={dataURI} />;
    }
  }

  return WithDataURIImpl;
};
