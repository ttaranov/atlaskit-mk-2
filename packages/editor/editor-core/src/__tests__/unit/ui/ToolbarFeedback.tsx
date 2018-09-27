import { mount } from 'enzyme';
import * as React from 'react';
import AkButton from '@atlaskit/button';
import { Popup } from '@atlaskit/editor-common';
import ToolbarFeedback, {
  getBrowserInfo,
  getDeviceInfo,
} from '../../../ui/ToolbarFeedback';
import { analyticsService } from '../../../analytics';

window.jQuery = {};

describe('@atlaskit/editor-core/ui/ToolbarFeedback', () => {
  describe('analytics', () => {
    it('should trigger analyticsService.trackEvent when feedback icon is clicked', () => {
      window.jQuery = { ajax: () => {} };
      const trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
      const toolbarOption = mount(<ToolbarFeedback />);
      toolbarOption.find(AkButton).simulate('click');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.feedback.button',
      );
      toolbarOption.unmount();
    });

    it('should open opt out popup for bitbucket when feedback icon is clicked', () => {
      window.jQuery = { ajax: () => {} };
      const toolbarOption = mount(<ToolbarFeedback product="bitbucket" />);
      expect(toolbarOption.find(Popup).length).toEqual(0);
      toolbarOption.find(AkButton).simulate('click');
      expect(toolbarOption.find(Popup).length).toEqual(1);
      toolbarOption.unmount();
    });

    describe('getBrowserInfo', () => {
      it('should return correct browser and its version', () => {
        expect(
          getBrowserInfo(
            'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64;Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; InfoPath.2)',
          ),
        ).toEqual('Microsoft Internet Explorer 8.0');
        expect(
          getBrowserInfo(
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
          ),
        ).toEqual('Chrome 35.0.1916.114');
        expect(
          getBrowserInfo(
            'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
          ),
        ).toEqual('Firefox 29.0');
        expect(
          getBrowserInfo(
            'Mozilla/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725 Netscape6/6.1',
          ),
        ).toEqual('Netscape6 6.1');
        expect(
          getBrowserInfo(
            'Opera/12.02 (Android 4.1; Linux; Opera Mobi/ADR-1111101157; U; en-US) Presto/2.9.201 Version/12.02',
          ),
        ).toEqual('Opera 12.02');
      });
    });

    describe('getDeviceInfo', () => {
      it('should return OS and its version', () => {
        expect(
          getDeviceInfo(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36',
            '5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36',
          ),
        ).toEqual('Mac OS X 10_13_3');
        expect(
          getDeviceInfo(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            '5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
          ),
        ).toEqual('iOS 11.0.0');
        expect(
          getDeviceInfo(
            'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Mobile Safari/537.36',
            '5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Mobile Safari/537.36',
          ),
        ).toEqual('Android 5.0');
      });
    });
  });
});
