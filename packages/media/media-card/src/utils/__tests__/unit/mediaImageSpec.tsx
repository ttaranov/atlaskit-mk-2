import * as React from 'react';
import { mount } from 'enzyme';
import { smallImage, tallImage } from '@atlaskit/media-test-helpers';
import { MediaImage } from '../../mediaImage';
import {
  CoverHorizontalImageComponent,
  CoverVerticalImageComponent,
  FitImageComponent,
} from '../../mediaImage/styled';

interface Dimensions {
  width: number;
  height: number;
}

describe('MediaImage', () => {
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  const setup = (
    crop: boolean,
    parentDimensions: Dimensions = { width: 100, height: 100 },
    imageDimensions: Dimensions = { width: 100, height: 100 },
  ) => {
    Element.prototype.getBoundingClientRect = () => parentDimensions as any;
    const component = mount(<MediaImage dataURI={smallImage} crop={crop} />);
    const img = component.find('img');
    const imgInstance = img.instance();
    Object.defineProperty(imgInstance, 'naturalHeight', {
      value: imageDimensions.height,
    });
    Object.defineProperty(imgInstance, 'naturalWidth', {
      value: imageDimensions.width,
    });
    img.simulate('load');
    return component;
  };

  afterAll(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('should use fit wrapper when "crop" is false', () => {
    const component = mount(<MediaImage dataURI={smallImage} crop={false} />);
    expect(component.find(FitImageComponent)).toHaveLength(1);
    expect(component).toMatchSnapshot();
  });

  it("should use vertical cover wrapper when crop is true and image w/h ratio less then container's", async () => {
    const component = setup(
      true,
      { width: 100, height: 100 },
      { width: 200, height: 400 },
    );
    expect(component.find(CoverVerticalImageComponent)).toHaveLength(1);
    expect(component).toMatchSnapshot();
  });

  it("should use horizontal cover wrapper when crop is true and image w/h ratio bigger then container's", () => {
    const component = setup(
      true,
      { width: 100, height: 100 },
      { width: 400, height: 200 },
    );
    expect(component.find(CoverHorizontalImageComponent)).toHaveLength(1);
    expect(component).toMatchSnapshot();
  });
});
