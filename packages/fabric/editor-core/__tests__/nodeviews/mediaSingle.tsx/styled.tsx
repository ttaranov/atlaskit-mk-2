/**
 * @jest-environment node
 * @see https://github.com/styled-components/jest-styled-components#styled-components--v2
 */
import * as React from 'react';
import { shallow } from 'enzyme';
import { Wrapper } from '../../../src/nodeviews/ui/mediaSingle/styled';

describe('mediaSingle - styled component', () => {
  describe('when align center', () => {
    const layout = 'center';

    it('should float none', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('float', 'none');
    });

    it('should clear both', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('clear', 'both');
    });

    it('should text align center', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('text-align', 'center');
    });
  });

  describe('when wrap right', () => {
    const layout = 'wrap-right';

    it('should float none', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('float', 'right');
    });

    it('should clear both', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('clear', 'right');
    });

    it('should text align left', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('text-align', 'left');
    });
  });

  describe('when wrap left', () => {
    const layout = 'wrap-left';

    it('should float none', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('float', 'left');
    });

    it('should clear both', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('clear', 'left');
    });

    it('should text align left', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('text-align', 'left');
    });
  });

  describe('when wide', () => {
    const layout = 'wide';

    it('should float none', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('float', 'none');
    });

    it('should clear both', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('clear', 'both');
    });

    it('should text align center', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('text-align', 'center');
    });
  });

  describe('when full width', () => {
    const layout = 'full-width';

    it('should float none', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('float', 'none');
    });

    it('should clear both', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('clear', 'both');
    });

    it('should text align center', () => {
      const wrapper = shallow(<Wrapper layout={layout} />);
      expect(wrapper).toHaveStyleRule('text-align', 'center');
    });
  });
});
