/**
 * Only used internally ATM
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component, CSSProperties } from 'react';
import { getCssFromImageOrientation } from '@atlaskit/media-ui';
import { ImageComponent } from './styled';

export interface MediaImageProps {
  dataURI: string;
  crop?: boolean;
  previewOrientation?: number;
}

export interface MediaImageState {
  isImageLoaded: boolean;
  imgWidth: number;
  imgHeight: number;
  parentWidth: number;
  parentHeight: number;
}

export class MediaImage extends Component<MediaImageProps, MediaImageState> {
  static defaultProps = {
    crop: true,
    width: '100%',
    height: '100%',
    className: '',
  };
  imageRef: React.RefObject<HTMLImageElement>;

  constructor(props: MediaImageProps) {
    super(props);
    this.imageRef = React.createRef();

    this.state = {
      isImageLoaded: false,
      imgWidth: 0,
      imgHeight: 0,
      parentWidth: Infinity,
      parentHeight: Infinity,
    };
  }

  // TODO FIL-4060 we need to check whether the dataURI changes in componentWillReceiveProps()
  // and if it does recalculate the image height and width

  componentDidMount() {
    const parent = ReactDOM.findDOMNode(this).parentElement;
    if (!parent) {
      return;
    }
    const { width, height } = parent.getBoundingClientRect();

    this.setState({
      parentWidth: width,
      parentHeight: height,
    });
  }

  onImageLoad = () => {
    if (!this.imageRef || !this.imageRef.current) {
      return;
    }
    this.setState({
      isImageLoaded: true,
      imgWidth: this.imageRef.current.naturalWidth,
      imgHeight: this.imageRef.current.naturalHeight,
    });
  };

  render() {
    const { crop, dataURI, previewOrientation } = this.props;
    const {
      parentWidth,
      parentHeight,
      imgWidth,
      imgHeight,
      isImageLoaded,
    } = this.state;

    const isImageSmallerThanContainer =
      imgWidth < parentWidth && imgHeight < parentHeight;
    const parentRatio = parentWidth / parentHeight;
    const imgRatio = imgWidth / imgHeight;

    /*
      Cover strategy means we want to full entire screen with an image. Here is an example:

         Image           Container   Result (░ - is what cropped out)
     ┌──────────────┐    ┌──────┐    ┌───┬──────┬───┐
     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│    │      │    │░░░│▓▓▓▓▓▓│░░░│
     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ -> │      │ => │░░░│▓▓▓▓▓▓│░░░│
     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│    │      │    │░░░│▓▓▓▓▓▓│░░░│
     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│    └──────┘    └───┴──────┴───┘
     └──────────────┘
    */
    const isCoverStrategy = crop;

    /*
      Fit strategy means image is fully inside container even if there is empty space left.
      Here is an example:

             Image            Container     Result
     ┌────────────────────┐    ┌──────┐    ┌──────┐
     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│    │      │    ├──────┤
     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ -> │      │ => │▓▓▓▓▓▓│
     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│    │      │    │▓▓▓▓▓▓│
     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│    │      │    ├──────┤
     └────────────────────┘    └──────┘    └──────┘
     */
    const isFitStrategy = !crop;

    /*
      Here is an example of when isImageMoreLandscapyThanContainer is true:

        Image      Container   OR   Image      Container
       ________      _____          ____           __
      |        | -> |     |        |    |   ->    |  |
      |________|    |_____|        |    |         |  |
                                   |    |         |  |
                                   |    |         |  |
                                   |____|         |__|

      For false just swap "Image" and "Container" in the example above.
     */
    const isImageMoreLandscapyThanContainer = imgRatio > parentRatio;

    /*
      When isStretchingAllowed is false image is as big as it is, but as small as container
      (according to strategy - cover or fit).
      isStretchingAllowed is true if image is bigger then container.
      This is mostly requirement for resizing feature of editor's. When image is initially bigger
      than it's container user must be able to resize it even larger then image itself.
     */
    const isStretchingAllowed = !isImageSmallerThanContainer;

    /*
      We do not want to show image until we finish deciding on sizing strategy.
      Though if it is a "fit" strategy we can display it right away, since it doesn't depend
      on isImageMoreLandscapyThanContainer nor it will change when isStretchingAllowed changes
      it's value after imgRatio and parentRatio get defined.
     */
    const showImage = isImageLoaded || isFitStrategy;

    const style: CSSProperties = {
      transform: 'translate(-50%, -50%)',
    };

    if (isStretchingAllowed) {
      if (isFitStrategy && isImageMoreLandscapyThanContainer) {
        /*
          Image matches its width to container's and height scales accordingly.

            Image       Container       Result
                       ┌─────────┐    ┌─────────┐
           ┌──────┐    │         │    ├─────────┤
           │▓▓▓▓▓▓│ -> │         │ => │▓▓▓▓▓▓▓▓▓│
           │▓▓▓▓▓▓│    │         │    │▓▓▓▓▓▓▓▓▓│
           └──────┘    │         │    ├─────────┤
                       └─────────┘    └─────────┘
         */
        style.width = '100%';
      } else if (isFitStrategy && !isImageMoreLandscapyThanContainer) {
        /*
          Image matches its height to container's and width scales accordingly.
         */
        style.height = '100%';
      } else if (isCoverStrategy && isImageMoreLandscapyThanContainer) {
        /*
          In order to cover whole container guaranteed (even in expense of stretching)
          image matches its height to container's. Width scales accordingly and crops out sides.

             Image       Container    Result (░ - is what cropped out)
                       ┌─────────┐    ┌──┬──────┬──┐
           ┌──────┐    │         │    │░░│▓▓▓▓▓▓│░░│
           │▓▓▓▓▓▓│ -> │         │ => │░░│▓▓▓▓▓▓│░░│
           │▓▓▓▓▓▓│    │         │    │░░│▓▓▓▓▓▓│░░│
           └──────┘    │         │    │░░│▓▓▓▓▓▓│░░│
                       └─────────┘    └──┴──────┴──┘
         */
        style.height = '100%';
      } else if (isCoverStrategy && !isImageMoreLandscapyThanContainer) {
        style.width = '100%';
      }
    } else {
      if (isFitStrategy) {
        /*
          We want image to be as wide and as height as container but not bigger then it's own size.

            Image       Container       Result
           ┌───────────┐    ┌─────────┐    ┌─────────┐
           │▓▓▓▓▓▓▓▓▓▓▓│    │         │    ├─────────┤
           │▓▓▓▓▓▓▓▓▓▓▓│    │         │    │▓▓▓▓▓▓▓▓▓│
           │▓▓▓▓▓▓▓▓▓▓▓│->  │         │ => │▓▓▓▓▓▓▓▓▓│
           └───────────┘    │         │    │▓▓▓▓▓▓▓▓▓│
                            │         │    ├─────────┤
                            └─────────┘    └─────────┘

         And if image is smaller it doesn't change its size

            Image       Container       Result
                       ┌──────────┐    ┌──────────┐
                       │          │    │          │
           ┌──────┐    │          │    │ ┌──────┐ │
           │▓▓▓▓▓▓│ -> │          │ => │ │▓▓▓▓▓▓│ │
           │▓▓▓▓▓▓│    │          │    │ │▓▓▓▓▓▓│ │
           └──────┘    │          │    │ └──────┘ │
                       │          │    │          │
                       └──────────┘    └──────────┘
         */
        style.maxWidth = '100%';
        style.maxHeight = '100%';
      } else if (isCoverStrategy && isImageMoreLandscapyThanContainer) {
        /*
          We want to fill container but we can't stretch an image if it's smaller then container.

            Image            Container       Result
           ┌────────────┐    ┌───────┐    ┌──┬───────┬──┐
           │▓▓▓▓▓▓▓▓▓▓▓▓│    │       │    │░░│▓▓▓▓▓▓▓│░░│
           │▓▓▓▓▓▓▓▓▓▓▓▓│    │       │    │░░│▓▓▓▓▓▓▓│░░│
           │▓▓▓▓▓▓▓▓▓▓▓▓│->  │       │ => │░░│▓▓▓▓▓▓▓│░░│
           │▓▓▓▓▓▓▓▓▓▓▓▓│    └───────┘    └──┴───────┴──┘
           └────────────┘

         */
        style.maxHeight = '100%';
      } else if (isCoverStrategy && !isImageMoreLandscapyThanContainer) {
        style.maxWidth = '100%';
      }
    }

    if (!showImage) {
      style.display = 'none';
    }

    if (previewOrientation && previewOrientation > 1) {
      const transform = getCssFromImageOrientation(previewOrientation);

      style.transform += ` ${transform}`;
    }

    return (
      <ImageComponent
        draggable={false}
        style={style}
        onLoad={this.onImageLoad}
        innerRef={this.imageRef}
        src={dataURI}
      />
    );
  }
}
