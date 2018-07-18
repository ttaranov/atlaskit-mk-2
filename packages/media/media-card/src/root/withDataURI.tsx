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
export interface WithDataURIServiceProps {
  readonly dataURIService?: DataUriService;
  readonly metadata?: MediaItemDetails;
  readonly appearance?: CardAppearance;
  readonly dimensions?: CardDimensions;
  readonly resizeMode?: ImageResizeMode;
  readonly preview?: string;
}

export interface WithDataURIState {
  dataURI?: string;
}

export interface WithDataURIProps {
  dataURI?: string;
}

export interface WithDataURI<TOwnProps>
  extends React.Component<
      TOwnProps & WithDataURIServiceProps,
      WithDataURIState
    > {
  componentWillReceiveProps(
    nextProps: Readonly<TOwnProps & WithDataURIServiceProps>,
    nextContext: any,
  ): void;
  updateDataURI(props: WithDataURIServiceProps): void;
}

// return type is "any" to avoid TS attempting to infer the return type
// if TS attempts to infer the return type it can NOT publish .d.ts files because WithDataURIImpl isn't exported
export function withDataURI<TOwnProps>(
  Component: React.ComponentClass<TOwnProps & WithDataURIProps>,
): React.ComponentClass<TOwnProps & WithDataURIServiceProps> {
  type WithDataURIImplProps = TOwnProps & WithDataURIServiceProps;
  class WithDataURIImpl
    extends React.Component<WithDataURIImplProps, WithDataURIState>
    implements WithDataURI<TOwnProps> {
    state: WithDataURIState = {};

    componentDidMount(): void {
      this.updateDataURI(this.props);
    }

    componentWillReceiveProps(nextProps: WithDataURIServiceProps): void {
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

    updateDataURI(props: WithDataURIServiceProps): void {
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
      const dataURI = this.state.dataURI || this.props.preview;
      const props = { ...(this.props as object) } as any;
      delete props.dataURIService;
      const otherProps = { dataURI, ...props } as Readonly<
        TOwnProps & WithDataURIProps
      >;

      return <Component {...otherProps} />;
    }
  }

  return WithDataURIImpl;
}
