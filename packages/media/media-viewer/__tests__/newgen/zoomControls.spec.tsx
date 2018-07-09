import * as React from 'react';
import { shallow } from 'enzyme';
import Button from '@atlaskit/button';
import { ZoomControls, ZoomControlsProps } from '../../src/newgen/zoomControls';
import { ZoomLevelIndicator } from '../../src/newgen/styled';
import { ZoomLevel } from '../../src/newgen/domain';

describe('Zooming', () => {
  describe('<ZoomControls />', () => {
    const setup = (props?: Partial<ZoomControlsProps>) => {
      const onChange = jest.fn();
      const component = shallow(
        <ZoomControls
          zoomLevel={new ZoomLevel()}
          onChange={onChange}
          {...props}
        />,
      );

      return {
        onChange,
        component,
      };
    };

    it('should increase and decrease zoom', () => {
      const { component, onChange } = setup();
      const zoomLevel = new ZoomLevel();

      component
        .find(Button)
        .first()
        .simulate('click');
      expect(onChange).lastCalledWith(zoomLevel.zoomOut());
      component
        .find(Button)
        .last()
        .simulate('click');
      expect(onChange).lastCalledWith(zoomLevel.zoomIn());
    });

    it('should not allow zooming above upper limit', () => {
      const { component, onChange } = setup({
        zoomLevel: new ZoomLevel(ZoomLevel.MAX),
      });
      component
        .find(Button)
        .last()
        .simulate('click');
      expect(onChange).not.toBeCalled();
    });

    it('should not allow zooming below lower limit', () => {
      const { component, onChange } = setup({
        zoomLevel: new ZoomLevel(ZoomLevel.MIN),
      });
      component
        .find(Button)
        .first()
        .simulate('click');
      expect(onChange).not.toBeCalled();
    });

    describe('zoom level indicator', () => {
      it('shows 100% zoom level', () => {
        const { component } = setup();
        expect(
          component
            .find(ZoomLevelIndicator)
            .dive()
            .text(),
        ).toEqual('100 %');
      });
    });
  });
});
