import * as React from 'react';
import { shallow } from 'enzyme';
import { MediaImage } from '../../src/utils';
import { ImageViewWrapper } from '../../src/utils/mediaImage/styled';

describe('<MediaImage />', () => {
  it('should render <ImageViewWrapper /> with crop default as "true"', () => {
    const component = shallow(<MediaImage dataURI="some-data-uri" />, {
      disableLifecycleMethods: true,
    });

    expect(component.find(ImageViewWrapper)).toHaveLength(1);
    expect(component.props().shouldCrop).toEqual(true);
    expect(component.props().style.backgroundImage).toEqual(
      'url(some-data-uri)',
    );
  });

  describe('#isSmallerThanWrapper', () => {
    it('should pass backgroundSize to "style" prop if image width and height are both smaller than parent container', () => {
      const component = shallow(<MediaImage dataURI="some-data-uri" />, {
        disableLifecycleMethods: true,
      });

      component.setState({
        imgWidth: 5,
        imgHeight: 10,
        parentWidth: 20,
        parentHeight: 20,
      });
      expect(component.props().style.backgroundSize).toEqual('5px 10px, auto');
    });

    it('should pass NOT backgroundSize to "style" prop if image width is greater than parent container width', () => {
      const component = shallow(<MediaImage dataURI="some-data-uri" />, {
        disableLifecycleMethods: true,
      });

      component.setState({
        imgWidth: 25,
        imgHeight: 10,
        parentWidth: 20,
        parentHeight: 20,
      });
      expect(component.props().style.backgroundSize).toEqual(undefined);
    });

    it('should pass NOT backgroundSize to "style" prop if image height is greater than parent container height', () => {
      const component = shallow(<MediaImage dataURI="some-data-uri" />, {
        disableLifecycleMethods: true,
      });

      component.setState({
        imgWidth: 5,
        imgHeight: 25,
        parentWidth: 20,
        parentHeight: 20,
      });
      expect(component.props().style.backgroundSize).toEqual(undefined);
    });
  });
});
