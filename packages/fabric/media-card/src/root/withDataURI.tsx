import * as React from 'react';
import {
  DataUriService,
  MediaItemDetails,
  ImageResizeMode,
} from '@atlaskit/media-core';
import { CardAppearance, CardDimensions } from '..';
import { isRetina } from '../utils/isRetina';
import { isLinkDetails } from '../utils/isLinkDetails';
import { defaultImageCardDimensions } from '../utils';
import {
  makeCancelablePromise,
  CanceledPromiseError,
  CancelablePromise,
} from '../utils/cancelablePromise';
import { DataUri } from '../../../media-core/src/services/dataUriService';

const SMALL_CARD_IMAGE_WIDTH = 32;
const SMALL_CARD_IMAGE_HEIGHT = 32;

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
    fetchImageDataUriPromise: CancelablePromise<DataUri>;
    state: WithDataURIState = {};

    componentDidMount(): void {
      this.updateDataURI(this.props);
    }

    componentWillUnmount() {
      this.fetchImageDataUriPromise.cancel();
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

    private dataURIWidth(retinaFactor): number {
      const { width } = this.props.dimensions || { width: undefined };

      if (this.isSmall()) {
        return SMALL_CARD_IMAGE_WIDTH * retinaFactor;
      }

      return (
        (typeof width === 'number' ? width : defaultImageCardDimensions.width) *
        retinaFactor
      );
    }

    private dataURIHeight(retinaFactor): number {
      const { height } = this.props.dimensions || { height: undefined };

      if (this.isSmall()) {
        return SMALL_CARD_IMAGE_HEIGHT * retinaFactor;
      }

      return (
        (typeof height === 'number'
          ? height
          : defaultImageCardDimensions.height) * retinaFactor
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

      const retinaFactor = isRetina() ? 2 : 1;
      const width = this.dataURIWidth(retinaFactor);
      const height = this.dataURIHeight(retinaFactor);
      const allowAnimated = appearance !== 'small';

      this.fetchImageDataUriPromise = makeCancelablePromise(
        dataURIService.fetchImageDataUri(
          { type: 'file', details: metadata },
          {
            width,
            height,
            mode: resizeMode,
            allowAnimated,
          },
        ),
      );

      this.fetchImageDataUriPromise.then(setDataURI).catch(error => {
        if (!(error instanceof CanceledPromiseError)) {
          clearDataURI();
        }
      });
    }

    render(): JSX.Element {
      const { ...otherProps } = this.props;
      const { dataURI } = this.state;
      return <Component {...otherProps} dataURI={dataURI} />;
    }
  }

  return WithDataURIImpl;
};
