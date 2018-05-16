jest.mock('../../service/uploadService');

import { Context, ContextFactory } from '@atlaskit/media-core';
import { Browser, BrowserConfig } from '../browser';
import { MediaPickerContext } from '../../domain/context';
import { UserEvent } from '../../outer/analytics/events';

class MockContext implements MediaPickerContext {
  trackEvent(event: UserEvent) {}
}

describe('Browser', () => {
  let browser: Browser | undefined;
  let context: Context;
  let browseConfig: BrowserConfig;

  beforeEach(() => {
    context = ContextFactory.create({
      serviceHost: '',
      authProvider: {} as any,
    });
    browseConfig = {
      uploadParams: {},
      useNewUploadService: true,
    };

    if (browser) {
      browser.teardown();
      browser = undefined;
    }
  });

  it('should append the input to the body', () => {
    const inputsBefore = document.querySelectorAll('input[type=file]');
    browser = new Browser(new MockContext(), context, browseConfig);
    const inputsAfter = document.querySelectorAll('input[type=file]');
    expect(inputsAfter.length).toBeGreaterThan(inputsBefore.length);
    expect(browser['uploadService'].addBrowse).toHaveBeenCalled();
  });

  it('should remove the input from the body', () => {
    browser = new Browser(new MockContext(), context, browseConfig);
    const inputsBefore = document.querySelectorAll('input[type=file]');
    browser.teardown();
    const inputsAfter = document.querySelectorAll('input[type=file]');
    expect(inputsAfter.length).toBeLessThan(inputsBefore.length);
    expect(browser['uploadService'].removeBrowse).toHaveBeenCalled();
  });
});
