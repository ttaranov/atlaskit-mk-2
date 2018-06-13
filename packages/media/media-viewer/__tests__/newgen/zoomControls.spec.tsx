import * as React from 'react';
import { shallow } from 'enzyme';
import Button from '@atlaskit/button';
import {
  ZoomControls,
  getZoomLevel,
  ZoomControlsProps,
} from '../../src/newgen/zoomControls';
import { ZoomLevel } from '../../src/newgen/styled';

describe('Zooming', () => {
  describe('<ZoomControls />', () => {
    const setup = (props?: Partial<ZoomControlsProps>) => {
      const onChange = jest.fn();
      const component = shallow(
        <ZoomControls zoomLevel={1} onChange={onChange} {...props} />,
      );

      return {
        onChange,
        component,
      };
    };

    it('should increase and decrease zoom linearly', () => {
      const { component, onChange } = setup();

      component
        .find(Button)
        .first()
        .simulate('click');
      expect(onChange).lastCalledWith(0.8);
      component
        .find(Button)
        .last()
        .simulate('click');
      expect(onChange).lastCalledWith(1.2);
    });

    it('should allow zooming with constrains', () => {
      const { component, onChange } = setup({ step: 10 });

      component
        .find(Button)
        .first()
        .simulate('click');
      expect(onChange).lastCalledWith(0.2);
      component
        .find(Button)
        .last()
        .simulate('click');
      expect(onChange).lastCalledWith(5);
    });

    describe('zoom level indicator', () => {
      it('shows 100% zoom level', () => {
        const { component } = setup({ zoomLevel: 1 });
        expect(
          component
            .find(ZoomLevel)
            .dive()
            .text(),
        ).toEqual('100 %');
      });

      it('shows zoom level without decimals', () => {
        const { component } = setup({ zoomLevel: 1.229 });
        expect(
          component
            .find(ZoomLevel)
            .dive()
            .text(),
        ).toEqual('123 %');
      });
    });
  });

  describe('getZoomLevel', () => {
    it('defaults', () => {
      expect(getZoomLevel(1, 'out')).toEqual(0.8);
      expect(getZoomLevel(1, 'in')).toEqual(1.2);
    });

    it('using step', () => {
      expect(getZoomLevel(5, 'out', 0.5)).toEqual(2.5);
      expect(getZoomLevel(2, 'in', 0.5)).toEqual(3);
    });

    it('boundaries', () => {
      expect(getZoomLevel(0.2, 'out', 0.5)).toEqual(0.2);
      expect(getZoomLevel(0.3, 'out', 1)).toEqual(0.2);
      expect(getZoomLevel(0.2, 'out')).toEqual(0.2);
      expect(getZoomLevel(5, 'in', 1)).toEqual(5);
      expect(getZoomLevel(5, 'in')).toEqual(5);
      expect(getZoomLevel(4, 'in', 2)).toEqual(5);
    });
  });
});
