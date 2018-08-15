declare var global: any; // we need define an interface for the Node global object when overwriting global objects, in this case FileReader
import * as util from '../../../src/util';
const fileSizeMbSpy = jest.spyOn(util, 'fileSizeMb');
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';
import { Ellipsify, Camera, Rectangle } from '@atlaskit/media-ui';
import {
  CONTAINER_INNER_SIZE,
  containerRect,
  ImageNavigator,
  Props as ImageNavigatorProps,
} from '../../../src/image-navigator';
import { ERROR, MAX_SIZE_MB } from '../../../src/avatar-picker-dialog';
import {
  ImageUploader,
  DragZone,
  DragZoneImage,
  DragZoneText,
  PaddedBreak,
} from '../../../src/image-navigator/styled';
import { ImageCropper } from '../../../src/image-cropper';
import Slider from '@atlaskit/field-range';
import { createMouseEvent, smallImage } from '@atlaskit/media-test-helpers';
import { errorIcon } from '../../../src/image-navigator/images';

describe('Image navigator', () => {
  let component: any;
  let onImageLoaded: () => void;
  let onPositionChanged: () => void;
  let onSizeChanged: () => void;
  let onRemoveImage: () => void;
  let onImageError: () => void;
  let onImageUploaded: () => void;
  let isLoading: boolean;

  const setup = (props?: Partial<ImageNavigatorProps>) => {
    return mount(
      <ImageNavigator
        imageSource={smallImage}
        onImageLoaded={onImageLoaded}
        onPositionChanged={onPositionChanged}
        onSizeChanged={onSizeChanged}
        onRemoveImage={onRemoveImage}
        onImageError={onImageError}
        onImageUploaded={onImageUploaded}
        isLoading={isLoading}
        {...props}
      />,
    );
  };

  beforeEach(() => {
    onImageLoaded = jest.fn();
    onPositionChanged = jest.fn();
    onSizeChanged = jest.fn();
    onRemoveImage = jest.fn();
    onImageError = jest.fn();
    onImageUploaded = jest.fn();
    isLoading = false;
  });

  describe('with an imageSource', () => {
    let imageCropper: any;
    let slider: any;
    beforeEach(() => {
      component = setup();
      imageCropper = () => component.find(ImageCropper);
      slider = () => component.find(Slider);
    });

    it('should have image cropper', () => {
      expect(imageCropper().length).toBe(1);
    });

    it('should have slider', () => {
      expect(slider().length).toBe(1);
    });

    describe('when landscape image is loaded', () => {
      const imageHeight = CONTAINER_INNER_SIZE * 2;
      const imageWidth = CONTAINER_INNER_SIZE * 4;

      beforeEach(() => {
        imageCropper()
          .props()
          .onImageSize(imageWidth, imageHeight);
        component.update();
      });

      it('should have image width set', () => {
        expect(imageCropper().props().imageWidth).toBe(imageWidth);
      });

      it('should have slider value set', () => {
        expect(slider().props().value).toBe(50);
      });

      it('should have image scale set', () => {
        expect(imageCropper().props().scale).toBe(0.5);
      });

      it('should have min scale set to minimum allowed', () => {
        const expectedMinScale = Math.max(
          CONTAINER_INNER_SIZE / imageWidth,
          CONTAINER_INNER_SIZE / imageHeight,
        );
        expect(slider().props().min).toBe(expectedMinScale * 100);
      });
    });

    describe('when portrait image is loaded', () => {
      const imageHeight = CONTAINER_INNER_SIZE * 4;
      const imageWidth = CONTAINER_INNER_SIZE * 2;
      beforeEach(() => {
        imageCropper()
          .props()
          .onImageSize(imageWidth, imageHeight);
        component.update();
      });

      it('should have image scale set', () => {
        expect(imageCropper().props().scale).toBe(0.5);
      });
    });

    describe('when image is smaller then container', () => {
      const imageHeight = CONTAINER_INNER_SIZE / 2;
      const imageWidth = CONTAINER_INNER_SIZE / 2;

      beforeEach(() => {
        imageCropper()
          .props()
          .onImageSize(imageWidth, imageHeight);
        component.update();
      });

      it('should have image scale maxed to fit CONTAINER_SIZE', () => {
        expect(imageCropper().props().scale).toBe(2);
      });
    });

    it('should change scale in state when slider is moved', () => {
      const camera = new Camera(containerRect, new Rectangle(10000, 10000));
      component.setState({ camera });
      slider()
        .props()
        .onChange(20);
      expect(component.state().scale).toBe(0.2);
    });

    it('should mark state as is dragging when mouse pressed down', () => {
      imageCropper()
        .props()
        .onDragStarted(0, 0);
      expect(component.state().isDragging).toBe(true);
    });

    it('should mark state as is not dragging when mouse unpressed', () => {
      imageCropper()
        .props()
        .onDragStarted(0, 0);
      document.dispatchEvent(createMouseEvent('mouseup'));
      expect(component.state().isDragging).toBe(false);
    });

    describe('when image is dragged', () => {
      const imageHeight = CONTAINER_INNER_SIZE * 2;
      const imageWidth = CONTAINER_INNER_SIZE * 2;
      beforeEach(() => {
        imageCropper()
          .props()
          .onImageSize(imageWidth, imageHeight);
        slider()
          .props()
          .onChange(100);
        onPositionChanged = jest.fn();
        component.setProps({ onPositionChanged });
      });

      it('should change state during drag', () => {
        imageCropper()
          .props()
          .onDragStarted(0, 0);
        document.dispatchEvent(
          createMouseEvent('mousemove', { screenX: 10, screenY: 10 }),
        );
        expect(component.state().cursorPos).toEqual({ x: 10, y: 10 });
        expect(component.state().imagePos).toEqual({ x: -62, y: -62 });

        document.dispatchEvent(
          createMouseEvent('mousemove', { screenX: -20, screenY: -30 }),
        );
        expect(component.state().cursorPos).toEqual({ x: -20, y: -30 });
        expect(component.state().imagePos).toEqual({ x: -92, y: -102 });

        document.dispatchEvent(createMouseEvent('mouseup'));
        expect(component.state().imagePos).toEqual({ x: -92, y: -102 });
      });
      it('should call onPositionChanged on drop', () => {
        imageCropper()
          .props()
          .onDragStarted(0, 0);
        document.dispatchEvent(
          createMouseEvent('mousemove', { screenX: 0, screenY: 0 }),
        );
        expect(onPositionChanged).not.toHaveBeenCalled();

        document.dispatchEvent(
          createMouseEvent('mousemove', { screenX: -20, screenY: -30 }),
        );
        expect(onPositionChanged).not.toHaveBeenCalled();

        document.dispatchEvent(createMouseEvent('mouseup'));
        expect(onPositionChanged).toHaveBeenCalledWith(120, 130);
      });
    });
    describe('when image is scaled', () => {
      it('should call onSizeChanged with new size', () => {
        const imageWidth = 20;
        const camera = new Camera(containerRect, new Rectangle(imageWidth, 1));
        component.setState({ camera });
        const { value } = slider().props();
        // decrease the slider by 5%
        slider()
          .props()
          .onChange(value * 0.95);

        // this need to be more specific
        expect(onSizeChanged).toHaveBeenCalled();
      });
      it('should call onPositionChanged with new coordinates', () => {
        const imageWidth = 20;
        const camera = new Camera(containerRect, new Rectangle(imageWidth, 1));
        component.setState({ camera });
        const { value } = slider().props();
        // decrease the slider by 5%
        slider()
          .props()
          .onChange(value * 0.95);

        // this need to be more specific
        expect(onPositionChanged).toHaveBeenCalled();
      });
      it('should render loading state when "isLoading" is true', () => {
        const component = setup({ isLoading: true });

        expect(component.find(Spinner)).toHaveLength(1);
        expect(component.find(DragZone).prop('showBorder')).toBeFalsy();
        expect(component.find(DragZoneImage)).toHaveLength(0);
        expect(component.find(DragZoneText)).toHaveLength(0);
        expect(component.find(ImageCropper)).toHaveLength(0);
        expect(component.find(Button)).toHaveLength(0);
        expect(component.find(PaddedBreak)).toHaveLength(0);
      });
    });
  });

  describe('with no imageSource', () => {
    beforeEach(() => {
      component = mount(
        <ImageNavigator
          onImageLoaded={onImageLoaded}
          onPositionChanged={onPositionChanged}
          onSizeChanged={onSizeChanged}
          onRemoveImage={onRemoveImage}
          onImageError={onImageError}
          onImageUploaded={onImageUploaded}
        />,
      );
    });

    it('should render ImageUploader to allow users to pick an image', () => {
      expect(component.find(ImageUploader)).toHaveLength(1);
    });

    describe('when a file is dropped', () => {
      class MockFileReader {
        onload: any;

        readAsDataURL() {
          this.onload({ target: this });
        }
      }

      const mockDropEvent = (file: any) => ({
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        dataTransfer: {
          files: [file],
        },
      });

      const droppedImage = new File(['dsjklDFljk'], 'nice-photo.png', {
        type: 'image/png',
      });

      let FileReaderSpy: any;

      beforeEach(() => {
        FileReaderSpy = jest
          .spyOn(global, 'FileReader')
          .mockImplementation(() => new MockFileReader());
      });

      afterEach(() => {
        FileReaderSpy.mockReset();
        FileReaderSpy.mockRestore();
      });

      it('should set imageFile state with the image', () => {
        const { onDrop } = component.find(DragZone).props();

        onDrop(mockDropEvent(droppedImage));

        expect(component.state('imageFile')).toBe(droppedImage);
        expect(onImageUploaded).toHaveBeenCalledWith(droppedImage);
      });

      it('should not call onImageUploaded when file is not an image', () => {
        const droppedImage = new File(['not an image'], 'text.txt', {
          type: 'text/plain',
        });
        const { onDrop } = component.find(DragZone).props();

        onDrop(mockDropEvent(droppedImage));

        expect(onImageUploaded).not.toHaveBeenCalled();
      });

      it('should not allow images greater than defined MB limit', () => {
        const { onDrop } = component.find(DragZone).props();
        fileSizeMbSpy.mockReturnValue(MAX_SIZE_MB + 1);

        onDrop(mockDropEvent(droppedImage));

        expect(onImageError).toHaveBeenCalledWith(ERROR.SIZE);
        expect(onImageUploaded).not.toHaveBeenCalled();
      });
    });
  });

  describe('when an image is removed', () => {
    it('should clear state', () => {
      component = shallow(
        <ImageNavigator
          imageSource={smallImage}
          onImageLoaded={onImageLoaded}
          onPositionChanged={onPositionChanged}
          onSizeChanged={onSizeChanged}
          onRemoveImage={onRemoveImage}
          onImageError={onImageError}
          onImageUploaded={onImageUploaded}
        />,
      );
      const { onRemoveImage: onRemoveImageProp } = component
        .find(ImageCropper)
        .props();
      onRemoveImageProp();
      expect(component.state().fileImageSource).toBeUndefined();
      expect(component.state().imageFile).toBeUndefined();
    });
  });

  describe('when an error state is set', () => {
    const errorMessage = 'Error message!';

    beforeEach(() => {
      component = mount(
        <ImageNavigator
          imageSource={smallImage}
          onImageLoaded={onImageLoaded}
          onPositionChanged={onPositionChanged}
          onSizeChanged={onSizeChanged}
          onRemoveImage={onRemoveImage}
          errorMessage={errorMessage}
          onImageError={onImageError}
          onImageUploaded={onImageUploaded}
        />,
      );
    });

    it('should display error message', () => {
      expect(component.find(Ellipsify).prop('text')).toBe(errorMessage);
    });

    it('should display error icon', () => {
      expect(component.find(DragZoneImage).props().src).toBe(errorIcon);
    });

    it('should not display image cropper', () => {
      expect(component.find(ImageCropper)).toHaveLength(0);
    });
  });
});
