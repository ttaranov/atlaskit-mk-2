import * as React from 'react';
import { shallow } from 'enzyme';
import Button from '@atlaskit/button';
import { ZoomControls, ZoomControlsProps } from '../../src/newgen/zoomControls';
import { ZoomLevel } from '../../src/newgen/styled';

describe('Zooming', () => {
  describe('<ZoomControls />', () => {
    const setup = (props?: Partial<ZoomControlsProps>) => {
      const onChange = jest.fn();
      const component = shallow(
        <ZoomControls zoom={100} onChange={onChange} {...props} />,
      );

      return {
        onChange,
        component,
      };
    };

    it('should increase and decrease zoom', () => {
      const { component, onChange } = setup();

      component
        .find(Button)
        .first()
        .simulate('click');
      expect(onChange).lastCalledWith(50);
      component
        .find(Button)
        .last()
        .simulate('click');
      expect(onChange).lastCalledWith(200);
    });

    it('should allow zooming with constrains', () => {
      const { component, onChange } = setup({ zoom: 100 });

      component
        .find(Button)
        .first()
        .simulate('click');
      expect(onChange).lastCalledWith(50);
      component
        .find(Button)
        .last()
        .simulate('click');
      expect(onChange).lastCalledWith(200);
    });

    it('should not allow zooming above upper limit', () => {
      const { component, onChange } = setup({ zoom: 500 });
      component
        .find(Button)
        .last()
        .simulate('click');
      expect(onChange).not.toBeCalled();
    });

    it('should not allow zooming below lower limit', () => {
      const { component, onChange } = setup({ zoom: 20 });
      component
        .find(Button)
        .first()
        .simulate('click');
      expect(onChange).not.toBeCalled();
    });

    describe('zoom level indicator', () => {
      it('shows 100% zoom level', () => {
        const { component } = setup({ zoom: 100 });
        expect(
          component
            .find(ZoomLevel)
            .dive()
            .text(),
        ).toEqual('100 %');
      });
    });
  });
});
