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
        return getElementDimension(this, dimension);
      }

      return (
        (typeof dimensionValue === 'number'
          ? dimensionValue
          : defaultImageCardDimensions[dimension]) * retinaFactor
      );
    }

    updateDataURI(props: WithDataURIProps): void {
      const { dataURIService, metadata, resizeMode, appearance } = props;

      const setDataURI = dataURI => this.setState({ dataURI });
      const clearDataURI = () => this.setState({ dataURI: undefined });

      // clear the dataURI if we're updating to undefined metadata or we're updating to a link
      if (!dataURIService || !metadata || isLinkDetails(metadata)) {
        clearDataURI();
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
      const { dataURI } = this.state;

      return <Component {...otherProps} dataURI={dataURI} />;
    }
  }

  return WithDataURIImpl;
};
