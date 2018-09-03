import * as React from 'react';
import { shallow } from 'enzyme';
import { Wrapper, Subtitle } from '../../styled';

describe('CardGenericViewSmall', () => {
  describe('InfoView', () => {
    describe('Wrapper', () => {
      it('should align at the top when valign=top', () => {
        const element = shallow(<Wrapper valign="top" />);
        expect(element).toHaveStyleRule('justify-content', 'flex-start');
      });

      it('should align at the bottom when valign=bottom', () => {
        const element = shallow(<Wrapper valign="bottom" />);
        expect(element).toHaveStyleRule('justify-content', 'flex-end');
      });

      it('should align at the center when valign is undefined', () => {
        const element = shallow(<Wrapper valign={undefined} />);
        expect(element).toHaveStyleRule('justify-content', 'space-around');
      });
    });

    describe('Subtitle', () => {
      it('should render as a link when isLink=true', () => {
        const element = shallow(<Subtitle isLink={true} />);
        expect(element).toMatchSnapshot();
      });

      it('should not render as a link when isLink=false', () => {
        const element = shallow(<Subtitle isLink={false} />);
        expect(element).toMatchSnapshot();
      });
    });
  });
});
