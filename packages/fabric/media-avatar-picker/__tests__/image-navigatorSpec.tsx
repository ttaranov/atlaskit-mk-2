import * as React from 'react';
import {mount} from 'enzyme';
import {CONTAINER_SIZE, ImageNavigator} from '../src/image-navigator';
import {ImageUploader, DragZone} from '../src/image-navigator/styled';
import {ImageCropper} from '../src/image-cropper';
import Slider from '@atlaskit/field-range';
import {createMouseEvent, smallImage} from '@atlaskit/media-test-helpers';

describe('Image navigator', () => {
  let component;
  let onImageChanged;
  let onPositionChanged;
  let onSizeChanged;
  beforeEach(() => {
    onImageChanged = jest.fn();
    onPositionChanged = jest.fn();
    onSizeChanged = jest.fn();
  });
  describe('with an imageSource', () => {
    let imageCropper;
    let slider;
    beforeEach(() => {
      component = mount(<ImageNavigator
        imageSource={smallImage}
        onImageChanged={onImageChanged}
        onPositionChanged={onPositionChanged}
        onSizeChanged={onSizeChanged}
      />);
      imageCropper = component.find(ImageCropper);
      slider = component.find(Slider);
    });

    it('should have image cropper', () => {
      expect(imageCropper.length).toBe(1);
    });

    it('should have slider', () => {
      expect(slider.length).toBe(1);
    });

    describe('when landscape image is loaded', () => {
      let imageHeight = CONTAINER_SIZE * 2;
      let imageWidth = CONTAINER_SIZE * 4;
      beforeEach(() => {
        imageCropper.props().onImageSize(imageWidth, imageHeight);
      });

      it('should have image width set', () => {
        expect(imageCropper.props().imageWidth).toBe(imageWidth);
      });

      it('should have slider value set', () => {
        expect(slider.props().value).toBe(50);
      });

      it('should have image scale set', () => {
        expect(imageCropper.props().scale).toBe(0.5);
      });

      it('should have min scale set to minimum allowed', () => {
        const expectedMinScale = Math.max(CONTAINER_SIZE / imageWidth, CONTAINER_SIZE / imageHeight);
        expect(slider.props().min).toBe(expectedMinScale * 100);
      });
    });

    describe('when portrait image is loaded', () => {
      let imageHeight = CONTAINER_SIZE * 4;
      let imageWidth = CONTAINER_SIZE * 2;
      beforeEach(() => {
        imageCropper.props().onImageSize(imageWidth, imageHeight);
      });

      it('should have image scale set', () => {
        expect(imageCropper.props().scale).toBe(0.5);
      });
    });

    describe('when image is smaller then container', () => {
      let imageHeight = CONTAINER_SIZE / 2;
      let imageWidth = CONTAINER_SIZE / 2;

      beforeEach(() => {
        imageCropper.props().onImageSize(imageWidth, imageHeight);
      });

      it('should have image scale maxed to fit CONTAINER_SIZE', () => {
        expect(imageCropper.props().scale).toBe(2);
      });
    });

    it('should change scale in state when slider is moved', () => {
      slider.props().onChange(20);
      expect(component.state().scale).toBe(0.2);
    });

    it('should mark state as is dragging when mouse pressed down', () => {
      imageCropper.props().onDragStarted();
      expect(component.state().isDragging).toBe(true);
    });

    it('should mark state as is not dragging when mouse unpressed', () => {
      imageCropper.props().onDragStarted();
      document.dispatchEvent(createMouseEvent('mouseup'));
      expect(component.state().isDragging).toBe(false);
    });

    describe('when image is dragged', () => {
      let imageHeight = CONTAINER_SIZE * 2;
      let imageWidth = CONTAINER_SIZE * 2;
      beforeEach(() => {
        imageCropper.props().onImageSize(imageWidth, imageHeight);
        slider.props().onChange(100);
        onPositionChanged = jest.fn();
        component.setProps({ onPositionChanged });
      });

      it('should change state during drag', () => {
        const imageDragStartPos = component.state().imageDragStartPos;

        imageCropper.props().onDragStarted();
        document.dispatchEvent(createMouseEvent('mousemove', {screenX: 0, screenY: 0}));
        expect(component.state().cursorInitPos).toEqual({x: 0, y: 0});
        expect(component.state().imagePos).toEqual({x: 0, y: 0});

        document.dispatchEvent(createMouseEvent('mousemove', {screenX: -20, screenY: -30}));
        expect(component.state().cursorInitPos).toEqual({x: 0, y: 0});
        expect(component.state().imagePos).toEqual({x: imageDragStartPos.x - 20, y: imageDragStartPos.y - 30});

        document.dispatchEvent(createMouseEvent('mouseup'));
        expect(component.state().cursorInitPos).toBe(undefined);
        expect(component.state().imageDragStartPos).toEqual({x: imageDragStartPos.x - 20, y: imageDragStartPos.y - 30});
      });
      it('should call onPositionChanged on drop', () => {
        const imageDragStartPos = component.state().imageDragStartPos;

        imageCropper.props().onDragStarted();
        document.dispatchEvent(createMouseEvent('mousemove', {screenX: 0, screenY: 0}));
        expect(onPositionChanged).not.toHaveBeenCalled();

        document.dispatchEvent(createMouseEvent('mousemove', {screenX: -20, screenY: -30}));
        expect(onPositionChanged).not.toHaveBeenCalled();

        document.dispatchEvent(createMouseEvent('mouseup'));
        expect(onPositionChanged).toHaveBeenCalledWith(imageDragStartPos.x + 20, imageDragStartPos.y + 30);
      });
    });
    describe('when image is scaled', () => {
      it('should call onSizeChanged with new size', () => {
        const imageWidth = 20;
        component.setState({ imageWidth });
        const { value } = slider.props();
        // decrease the slider by 5%
        slider.props().onChange(value * 0.95);

        // this need to be more specific
        expect(onSizeChanged).toHaveBeenCalled();
      });
      it('should call onPositionChanged with new coordinates', () => {
        const imageWidth = 20;
        component.setState({ imageWidth });
        const { value } = slider.props();
        // decrease the slider by 5%
        slider.props().onChange(value * 0.95);

        // this need to be more specific
        expect(onPositionChanged).toHaveBeenCalled();
      });
    });
  });
  describe('with no imageSource', () => {
    beforeEach(() => {
      component = mount(<ImageNavigator
        onImageChanged={onImageChanged}
        onPositionChanged={onPositionChanged}
        onSizeChanged={onSizeChanged}
      />);
    });
    it('should render ImageUploader to allow users to pick an image', () => {
      expect(component.find(ImageUploader)).toHaveLength(1);
    });
    describe('when a file is dropped', () => {
      const mockDropEvent = file => ({
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        dataTransfer: {
          files: [file],
        }
      });
      it('should set imageFile state with the image', (done) => {
        const droppedImage = new File(['dsjklDFljk'], 'nice-photo.png', {
          type: 'image/png',
        });
        const { onDrop } = component.find(DragZone).props();

        onDrop(mockDropEvent(droppedImage));

        setTimeout(() => {
          expect(component.state('imageFile')).toBe(droppedImage);
          done();
        });
        // a better test would be something like
        // expect(onImageChanged).toHaveBeenCalledWith(droppedImage, { x: 0, y: 0, size: width });
      });
      it('should not call onImageDropped when file is not an image', () => {
        const droppedImage = new File(['not an image'], 'text.txt', {
          type: 'text/plain',
        });
        const { onDrop } = component.find(DragZone).props();

        onDrop(mockDropEvent(droppedImage));

        expect(onImageChanged).not.toHaveBeenCalled();
      });
    });
  });
});
