jest.mock('../../../newgen/viewers/video/fullscreen');
import * as React from 'react';
import { mount } from 'enzyme';
import FullScreenIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidHdCircleIcon from '@atlaskit/icon/glyph/vid-hd-circle';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import FieldRange from '@atlaskit/field-range';
import {
  CustomVideo,
  CustomVideoProps,
} from '../../../newgen/viewers/video/customVideo';
import { toggleFullscreen } from '../../../newgen/viewers/video/fullscreen';
import { TimeRange } from '../../../newgen/viewers/video/TimeRange';
import { CurrentTime } from '../../../newgen/viewers/video/styled';
import { Shortcut } from '../../../newgen/shortcut';

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

      expect(component.find(FieldRange).prop('value')).toEqual(1);
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
      ).toEqual(FullScreenIcon);
    });

    it('should render hd button if available', () => {
      const { component } = setup({
        isHDAvailable: true,
      });

      expect(component.find(Button)).toHaveLength(4);
      expect(
        (component
          .find(Button)
          .at(2)
          .prop('iconBefore') as any).type,
      ).toEqual(VidHdCircleIcon);
      component.setProps({
        isHDAvailable: false,
      });
      expect(component.find(Button)).toHaveLength(3);
    });

    it('should render spinner when the video is in loading state', () => {
      const { component } = setup();

      component.find('video').simulate('waiting');
      expect(component.find(Spinner)).toHaveLength(1);
    });
  });

  describe('interaction', () => {
    it('should use keyboard shortcuts to toggle video state', () => {
      const showControls = jest.fn();
      const { component } = setup({ showControls });

      component
        .find(Shortcut)
        .first()
        .prop('handler')();
      component
        .find(Shortcut)
        .last()
        .prop('handler')();

      expect(component.find(Shortcut)).toHaveLength(2);
      expect(showControls).toHaveBeenCalledTimes(2);
    });

    it('should fire callback when hd button is clicked', () => {
      const onHDToggleClick = jest.fn();
      const { component } = setup({
        isHDAvailable: true,
        onHDToggleClick,
      });

      component
        .find(Button)
        .at(2)
        .simulate('click');
      expect(onHDToggleClick).toHaveBeenCalledTimes(1);
    });

    it('should request full screen when fullscreen button is clicked', () => {
      const { component } = setup();

      component
        .find(Button)
        .last()
        .simulate('click');
      expect(toggleFullscreen).toHaveBeenCalledTimes(1);
    });

    it('should update TimeRange when time changes', () => {
      const { component } = setup();

      component.find('video').simulate('timeUpdate', {
        target: {
          currentTime: 10,
          buffered: [],
        },
      });
      expect(component.find(TimeRange).prop('currentTime')).toEqual(10);
    });

    it('should update buffered time when it changes', () => {
      const { component } = setup();

      component.find('video').simulate('timeUpdate', {
        target: {
          currentTime: 10,
          buffered: {
            length: 1,
            end: () => 10,
          },
        },
      });
      expect(component.find(TimeRange).prop('bufferedTime')).toEqual(10);
    });

    it('should update FieldRange when volume changes', () => {
      const { component } = setup();

      component.find('video').simulate('volumeChange', {
        target: {
          volume: 0.3,
        },
      });
      expect(component.find(FieldRange).prop('value')).toEqual(0.3);
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
