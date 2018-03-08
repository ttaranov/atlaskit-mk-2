import * as React from 'react';
import { shallow } from 'enzyme';
import Wrapper from '../../../src/ui/MediaSingle/styled';

describe('mediaSingle - styled component', () => {
  describe('when align center', () => {
    const layout = 'center';

    it('should float none', () => {
      const wrapper = shallow(
        <Wrapper layout={layout} height={100} width={100} />,
      );
      expect(wrapper).toHaveStyleRule('float', 'none');
    });
  });

  describe('when wrap right', () => {
    const layout = 'wrap-right';

    it('should float none', () => {
      const wrapper = shallow(
        <Wrapper layout={layout} height={100} width={100} />,
      );
      expect(wrapper).toHaveStyleRule('float', 'right');
    });
  });

  describe('when wrap left', () => {
    const layout = 'wrap-left';

    it('should float none', () => {
      const wrapper = shallow(
        <Wrapper layout={layout} height={100} width={100} />,
      );
      expect(wrapper).toHaveStyleRule('float', 'left');
    });
  });

  describe('when wide', () => {
    const layout = 'wide';

    it('should float none', () => {
      const wrapper = shallow(
        <Wrapper layout={layout} height={100} width={100} />,
      );
      expect(wrapper).toHaveStyleRule('float', 'none');
    });
  });

  describe('when full width', () => {
    const layout = 'full-width';

    it('should float none', () => {
      const wrapper = shallow(
        <Wrapper layout={layout} height={100} width={100} />,
      );
      expect(wrapper).toHaveStyleRule('float', 'none');
    });
  });
});
