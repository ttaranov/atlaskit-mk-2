import * as React from 'react';
import { mount } from 'enzyme';
import EditorMediaFullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidHdCircleIcon from '@atlaskit/icon/glyph/vid-hd-circle';
import Button from '@atlaskit/button';
import {
  CustomVideo,
  CustomVideoProps,
} from '../../src/newgen/viewers/video/customVideo';
import { TimeRange } from '../../src/newgen/viewers/video/TimeRange';
import {
  VolumeRange,
  CurrentTime,
} from '../../src/newgen/viewers/video/styled';
import { Shortcut } from '../../src/newgen/shortcut';

describe('<CustomVideo />', () => {
  const setup = (props?: Partial<CustomVideoProps>) => {
    const onChange = jest.fn();
    const component = mount(
      <CustomVideo
        isAutoPlay={true}
        isHDAvailable={false}
        src="video-src"
        {...props}
      />,
    );

    return {
      component,
      onChange,
    };
  };

  describe('render', () => {
    it('should render the video element', () => {
      const { component } = setup();

      expect(component.find('video')).toHaveLength(1);
    });

    it('should render the right icon based on the video state (play/pause)', () => {
      const { component } = setup();
      const button = component.find(Button).first() as any;

      expect(button.prop('iconBefore').type).toEqual(VidPlayIcon);
    });

    it('should render a time range with the time properties', () => {
      const { component } = setup();

      expect(component.find(TimeRange)).toHaveLength(1);
      expect(component.find(TimeRange).prop('currentTime')).toEqual(0);
      expect(component.find(TimeRange).prop('duration')).toEqual(0);
      expect(component.find(TimeRange).prop('bufferedTime')).toEqual(0);
    });

    it('should render the volume controls', () => {
      const { component } = setup();

      expect(component.find(VolumeRange).prop('value')).toEqual(1);
    });

    it('should render the time (current/total) in the right format', () => {
      const { component } = setup();

      expect(component.find(CurrentTime).text()).toEqual('0:00 / 0:00');
    });

    it('should render the fullscreen button', () => {
      const { component } = setup();

      expect(
        (component
          .find(Button)
          .last()
          .prop('iconBefore') as any).type,
      ).toEqual(EditorMediaFullWidthIcon);
    });

    it('should render hd button if available', () => {
      const { component } = setup({
        isHDAvailable: true,
      });

      expect(component.find(Button)).toHaveLength(4);
      expect(
        (component
          .find(Button)
          .at(1)
          .prop('iconBefore') as any).type,
      ).toEqual(VidHdCircleIcon);
      component.setProps({
        isHDAvailable: false,
      });
      expect(component.find(Button)).toHaveLength(3);
    });
  });

  describe('interaction', () => {
    it('should use keyboard shortcuts to toggle video state', () => {
      const showControls = jest.fn();
      const { component } = setup({ showControls });

      component.find(Shortcut).prop('handler')();

      expect(showControls).toHaveBeenCalledTimes(1);
    });

    it('should fire callback when hd button is clicked', () => {
      const onHDToggleClick = jest.fn();
      const { component } = setup({
        isHDAvailable: true,
        onHDToggleClick,
      });

      component
        .find(Button)
        .at(1)
        .simulate('click');
      expect(onHDToggleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('auto play', () => {
    it('should use autoplay when requested', () => {
      const { component } = setup({
        isHDAvailable: true,
        isAutoPlay: true,
      });
      expect(component.find({ autoPlay: true })).toHaveLength(2);
    });

    it('should not use autoplay when not requested', () => {
      const { component } = setup({
        isHDAvailable: true,
        isAutoPlay: false,
      });
      expect(component.find({ autoPlay: true })).toHaveLength(0);
    });
  });
});
