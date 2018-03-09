import * as React from 'react';
import { Component } from 'react';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';
import Button from '@atlaskit/button';
import ScaleLargeIcon from '@atlaskit/icon/glyph/media-services/scale-large';
import ScaleSmallIcon from '@atlaskit/icon/glyph/media-services/scale-small';
import { ImageCropper, OnLoadHandler } from '../image-cropper';
import Slider from '@atlaskit/field-range';
import Spinner from '@atlaskit/spinner';
import {
  Container,
  SliderContainer,
  FileInput,
  ImageUploader,
  DragZone,
  DragZoneImage,
  DragZoneText,
  SelectionBlocker,
  PaddedBreak,
} from './styled';
import { uploadPlaceholder, errorIcon } from './images';
import { constrainPos, constrainScale } from '../constraint-util';
import { dataURItoFile, fileSizeMb } from '../util';
import { ERROR, MAX_SIZE_MB, ACCEPT } from '../avatar-picker-dialog';
import { Ellipsify } from '@atlaskit/media-ui';

export const CONTAINER_SIZE = akGridSizeUnitless * 32;

// Large images (a side > CONTAINER_SIZE) will have a scale between 0 - 1.0
// Small images (a side < CONTAINER_SIZE) will have scales greater than 1.0
// Therefore the context of the slider range min-max depends on the size of the image.
// This constant is used for the max value for smaller images, as the (scale * 100) will be greater than 100.
export const MAX_SMALL_IMAGE_SCALE = 2500;

export interface CropProperties {
  x: number;
  y: number;
  size: number;
}

export interface Props {
  imageSource?: string;
  errorMessage?: string;
  onImageLoaded: (file: File, crop: CropProperties) => void;
  onLoad?: OnLoadHandler;
  onPositionChanged: (x: number, y: number) => void;
  onSizeChanged: (size: number) => void;
  onRemoveImage: () => void;
  onImageUploaded: (file: File) => void;
  onImageError: (errorMessage: string) => void;
  isLoading?: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface State {
  imageWidth?: number;
  imageHeight?: number;
  imagePos: Position;
  imageDragStartPos: Position;
  cursorInitPos?: Position;
  scale: number;
  isDragging: boolean;
  minScale?: number;
  fileImageSource?: string;
  imageFile?: File;
  isDroppingFile: boolean;
}

const defaultState = {
  imageWidth: undefined,
  imagePos: { x: 0, y: 0 },
  minScale: 1,
  scale: 1,
  isDragging: false,
  imageDragStartPos: { x: 0, y: 0 },
  fileImageSource: undefined,
  isDroppingFile: false,
};

export class ImageNavigator extends Component<Props, State> {
  state: State = defaultState;

  componentWillMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = e => {
    if (this.state.isDragging) {
      const { imageDragStartPos, scale } = this.state;
      const imageWidth = this.state.imageWidth as number;
      const imageHeight = this.state.imageHeight as number;
      const { screenX: x, screenY: y } = e;
      const cursorInitPos = this.state.cursorInitPos || { x, y };
      const constrainedPos = constrainPos(
        imageDragStartPos.x + (x - cursorInitPos.x),
        imageDragStartPos.y + (y - cursorInitPos.y),
        imageWidth,
        imageHeight,
        scale,
        CONTAINER_SIZE,
      );
      this.setState({
        cursorInitPos,
        imagePos: constrainedPos,
      });
    }
  };

  onMouseUp = () => {
    const { imagePos, scale } = this.state;
    this.props.onPositionChanged(
      Math.abs(Math.round(imagePos.x / scale)),
      Math.abs(Math.round(imagePos.y / scale)),
    );
    this.setState({
      cursorInitPos: undefined,
      isDragging: false,
      imageDragStartPos: imagePos,
    });
  };

  onDragStarted = () => {
    this.setState({
      isDragging: true,
    });
  };

  /**
   * When scale change we want to zoom in/out relative to the center of the frame.
   * @param scale New scale in 0-100 format.
   */
  onScaleChange = scale => {
    const {
      imageWidth: imgWidth,
      imageHeight: imgHeight,
      scale: currentScale,
    } = this.state;
    const imageWidth = imgWidth as number;
    const imageHeight = imgHeight as number;
    const newScale = constrainScale(
      scale / 100,
      currentScale,
      imageWidth,
      imageHeight,
      CONTAINER_SIZE,
    );
    const oldScale = currentScale;
    const scaleRelation = newScale / oldScale;
    const oldCenterPixel: Position = {
      x: CONTAINER_SIZE / 2 - this.state.imagePos.x,
      y: CONTAINER_SIZE / 2 - this.state.imagePos.y,
    };
    const newCenterPixel: Position = {
      x: scaleRelation * oldCenterPixel.x,
      y: scaleRelation * oldCenterPixel.y,
    };
    const imagePos = constrainPos(
      CONTAINER_SIZE / 2 - newCenterPixel.x,
      CONTAINER_SIZE / 2 - newCenterPixel.y,
      imageWidth,
      imageHeight,
      currentScale,
      CONTAINER_SIZE,
    );
    const haveRenderedImage = !!this.state.imageWidth;
    if (haveRenderedImage) {
      // adjust cropping properties by scale value
      const x = Math.abs(Math.round(imagePos.x / newScale));
      const y = Math.abs(Math.round(imagePos.y / newScale));
      const minSize = Math.min(imageWidth, imageHeight);
      const size =
        minSize < CONTAINER_SIZE
          ? minSize
          : Math.round(CONTAINER_SIZE / newScale);
      this.props.onPositionChanged(x, y);
      this.props.onSizeChanged(size);
    }
    this.setState({
      scale: newScale,
      imagePos,
    });
  };

  /**
   * This gets called when the cropper loads an image
   * at this point we will be able to get the height/width
   * @param width the width of the image
   * @param height the height of the image
   */
  onImageSize = (width, height) => {
    const { imageFile, imagePos } = this.state;
    const scale = this.calculateMinScale(width, height);
    // imageFile will not exist if imageSource passed through props.
    // therefore we have to create a File, as one needs to be raised by dialog parent component when Save clicked.
    const file = imageFile || (this.dataURI && dataURItoFile(this.dataURI));
    if (file) {
      this.props.onImageLoaded(file, {
        ...imagePos,
        size: CONTAINER_SIZE / scale,
      });
    }
    this.setState({
      imageWidth: width,
      imageHeight: height,
      minScale: scale,
      scale,
    });
  };

  calculateMinScale(width: number, height: number): number {
    return Math.max(CONTAINER_SIZE / width, CONTAINER_SIZE / height);
  }

  validateFile(imageFile: File): string | undefined {
    if (ACCEPT.indexOf(imageFile.type) === -1) {
      return ERROR.FORMAT;
    } else if (fileSizeMb(imageFile) > MAX_SIZE_MB) {
      return ERROR.SIZE;
    }
  }

  readFile(imageFile: File) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent) => {
      const fileImageSource = (e.target as FileReader).result;
      const { onImageUploaded } = this.props;

      if (onImageUploaded) {
        onImageUploaded(imageFile);
      }

      this.setState({ fileImageSource, imageFile });
    };
    reader.readAsDataURL(imageFile);
  }

  // Trick to have a nice <input /> appearance
  onUploadButtonClick = e => {
    const input = e.target.querySelector('#image-input');

    if (input) {
      input.click();
    }
  };

  onFileChange = e => {
    e.stopPropagation();
    const file = e.target.files[0];
    const validationError = this.validateFile(file);

    if (validationError) {
      this.props.onImageError(validationError);
    } else {
      this.readFile(file);
    }
  };

  updateDroppingState(e: Event, state: boolean) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ isDroppingFile: state });
  }

  onDragEnter = e => {
    this.updateDroppingState(e, true);
  };

  onDragOver = e => {
    this.updateDroppingState(e, true);
  };

  onDragLeave = e => {
    this.updateDroppingState(e, false);
  };

  onDrop = e => {
    e.stopPropagation();
    e.preventDefault();
    const dt = e.dataTransfer;
    const file = dt.files[0];
    const validationError = this.validateFile(file);

    this.setState({ isDroppingFile: false });

    if (validationError) {
      this.props.onImageError(validationError);
    } else {
      this.readFile(file);
    }
  };

  renderDraZone = () => {
    const { isDroppingFile } = this.state;
    const { errorMessage, isLoading } = this.props;
    const showBorder = !isLoading && !!!errorMessage;
    const dropZoneImageSrc = errorMessage ? errorIcon : uploadPlaceholder;
    let dragZoneText = errorMessage || 'Drag and drop your images here';
    const dragZoneAlt = errorMessage || 'Upload image';

    return (
      <DragZone
        showBorder={showBorder}
        isDroppingFile={isDroppingFile}
        onDragLeave={this.onDragLeave}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
      >
        {isLoading ? (
          <Spinner size="medium" />
        ) : (
          <div>
            <DragZoneImage src={dropZoneImageSrc} alt={dragZoneAlt} />
            <DragZoneText isFullSize={!!errorMessage}>
              <Ellipsify text={dragZoneText} lines={3} />
            </DragZoneText>
          </div>
        )}
      </DragZone>
    );
  };

  renderImageUploader() {
    const { errorMessage, isLoading } = this.props;
    const separatorText = errorMessage ? 'Try again' : 'or';

    return (
      <ImageUploader>
        {this.renderDraZone()}
        {isLoading ? null : (
          <div>
            <PaddedBreak>{separatorText}</PaddedBreak>
            <Button
              onClick={this.onUploadButtonClick as any}
              isDisabled={isLoading}
            >
              Upload a photo
              <FileInput
                type="file"
                id="image-input"
                onChange={this.onFileChange}
                accept={ACCEPT.join(',')}
              />
            </Button>
          </div>
        )}
      </ImageUploader>
    );
  }

  onRemoveImage = () => {
    this.setState(defaultState);
    this.props.onRemoveImage();
  };

  renderImageCropper(dataURI: string) {
    const { imageWidth, imagePos, scale, isDragging } = this.state;
    const { onLoad, onImageError } = this.props;
    const { onDragStarted, onImageSize, onRemoveImage } = this;

    const minScale = this.state.minScale as number;

    return (
      <div>
        <ImageCropper
          scale={scale}
          imageSource={dataURI}
          imageWidth={imageWidth}
          containerSize={CONTAINER_SIZE}
          isCircularMask={false}
          top={imagePos.y}
          left={imagePos.x}
          onDragStarted={onDragStarted}
          onImageSize={onImageSize}
          onLoad={onLoad}
          onRemoveImage={onRemoveImage}
          onImageError={onImageError}
        />
        <SliderContainer>
          <ScaleSmallIcon label="scale-small-icon" />
          <Slider
            value={scale * 100}
            min={minScale * 100}
            max={minScale > 1 ? MAX_SMALL_IMAGE_SCALE : 100}
            onChange={this.onScaleChange}
          />
          <ScaleLargeIcon label="scale-large-icon" />
        </SliderContainer>
        {isDragging ? <SelectionBlocker /> : null}
      </div>
    );
  }

  // We prioritize passed image rather than the one coming from the uploader
  private get dataURI(): string | undefined {
    const { imageSource, errorMessage } = this.props;
    const { fileImageSource } = this.state;

    return errorMessage ? undefined : imageSource || fileImageSource;
  }

  render() {
    const { isLoading } = this.props;
    const { dataURI } = this;
    const content =
      dataURI && !isLoading
        ? this.renderImageCropper(dataURI)
        : this.renderImageUploader();

    return <Container>{content}</Container>;
  }
}
