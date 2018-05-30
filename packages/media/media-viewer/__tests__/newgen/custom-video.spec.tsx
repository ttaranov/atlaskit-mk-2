import * as React from 'react';
import { mount } from 'enzyme';
import EditorMediaFullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
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
    const component = mount(<CustomVideo src="video-src" {...props} />);

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
  });

  describe('interaction', () => {
    it('should use keyboard shortcuts to toggle video state', () => {
      const showControls = jest.fn();
      const { component } = setup({ showControls });

      component.find(Shortcut).prop('handler')();

      expect(showControls).toHaveBeenCalledTimes(1);
    });
  });
});
