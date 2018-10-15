import * as React from 'react';
import { mount } from 'enzyme';
import { MediaImage } from '../../mediaImage';
import { ImageComponent } from '../../mediaImage/styled';

describe('MediaImage', () => {
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  const dimensionsMap = {
    isImageMoreLandscapyThanContainer: {
      imageIsSmallerThanContainer: [[200, 100], [500, 500]],
      imageIsBiggerThanContainer: [[2000, 1000], [500, 500]],
    },
    isImageMorePortraityThanContainer: {
      imageIsSmallerThanContainer: [[100, 200], [500, 500]],
      imageIsBiggerThanContainer: [[1000, 2000], [500, 500]],
    },
  };

  const setup = (
    isCoverStrategy: boolean,
    isImageMoreLandscapyThanContainer: boolean,
    imageIsSmallerThanContainer: boolean,
    loadImageImmediately: boolean = true,
  ) => {
    const [imageDimentions, containerDimentions] = dimensionsMap[
      isImageMoreLandscapyThanContainer
        ? 'isImageMoreLandscapyThanContainer'
        : 'isImageMorePortraityThanContainer'
    ][
      imageIsSmallerThanContainer
        ? 'imageIsSmallerThanContainer'
        : 'imageIsBiggerThanContainer'
    ];

    Element.prototype.getBoundingClientRect = () =>
      ({
        width: containerDimentions[0],
        height: containerDimentions[1],
      } as any);
    const component = mount(
      <MediaImage dataURI="data:image/png;base64," crop={isCoverStrategy} />,
    );
    const img = component.find('img');
    const imgInstance = img.instance();
    Object.defineProperty(imgInstance, 'naturalHeight', {
      value: imageDimentions[1],
    });
    Object.defineProperty(imgInstance, 'naturalWidth', {
      value: imageDimentions[0],
    });
    if (loadImageImmediately) {
      img.simulate('load');
    }
    return component.find(ImageComponent);
  };

  afterAll(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  describe("when image hasn't been loaded yet", () => {
    it('should not show image yet with cover strategy', () => {
      const component = setup(true, true, true, false);
      expect(component.props().style).toEqual(
        expect.objectContaining({
          display: 'none',
        }),
      );
    });
    it('should show image right away with fit strategy', () => {
      const component = setup(false, true, true, false);
      expect(component.props().style).not.toEqual(
        expect.objectContaining({
          display: 'none',
        }),
      );
    });
  });

  describe('when image is more landscapy than container', () => {
    describe('when image is smaller than container', () => {
      it('should have right style for cover strategy', () => {
        const component = setup(true, true, true);
        expect(component.props().style).toEqual({ maxHeight: '100%' });
      });
      it('should have right style for fit strategy', () => {
        const component = setup(false, true, true);
        expect(component.props().style).toEqual({
          maxWidth: '100%',
          maxHeight: '100%',
        });
      });
    });
    describe('when image is bigger than container', () => {
      it('should have right style for cover strategy', () => {
        const component = setup(true, true, false);
        expect(component.props().style).toEqual({ height: '100%' });
      });
      it('should have right style for fit strategy', () => {
        const component = setup(false, true, false);
        expect(component.props().style).toEqual({
          width: '100%',
        });
      });
    });
  });
  describe('when image is more portraity than container', () => {
    describe('when image is smaller than container', () => {
      it('should have right style for cover strategy', () => {
        const component = setup(true, false, true);
        expect(component.props().style).toEqual({ maxWidth: '100%' });
      });
      it('should have right style for fit strategy', () => {
        const component = setup(false, false, true);
        expect(component.props().style).toEqual({
          maxWidth: '100%',
          maxHeight: '100%',
        });
      });
    });
    describe('when image is bigger than container', () => {
      it('should have right style for cover strategy', () => {
        const component = setup(true, false, false);
        expect(component.props().style).toEqual({ width: '100%' });
      });
      it('should have right style for fit strategy', () => {
        const component = setup(false, false, false);
        expect(component.props().style).toEqual({
          height: '100%',
        });
      });
    });
  });
});
