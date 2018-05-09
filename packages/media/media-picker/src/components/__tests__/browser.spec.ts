jest.mock('../../service/uploadServiceFactory');

import { ContextFactory } from '@atlaskit/media-core';
import { Browser } from '../browser';
import { MediaPickerContext } from '../../domain/context';
import { UserEvent } from '../../outer/analytics/events';
import { UploadParams } from '../..';

class MockContext implements MediaPickerContext {
  trackEvent(event: UserEvent) {}
}

class MockConfig {
  uploadParams: UploadParams;
}

describe('Browser', () => {
  let browser: Browser | undefined;
  let context;

  beforeEach(() => {
    context = ContextFactory.create({
      serviceHost: '',
      authProvider: {} as any,
    });

    if (browser) {
      browser.teardown();
      browser = undefined;
    }
  });

  it('should append the input to the body', () => {
    const inputsBefore = document.querySelectorAll('input[type=file]');
    browser = new Browser(new MockContext(), context, new MockConfig());
    const inputsAfter = document.querySelectorAll('input[type=file]');
    expect(inputsAfter.length).toBeGreaterThan(inputsBefore.length);
    expect(browser['uploadService'].addBrowse).toHaveBeenCalled();
  });

  it('should remove the input from the body', () => {
    browser = new Browser(new MockContext(), context, new MockConfig());
    const inputsBefore = document.querySelectorAll('input[type=file]');
    browser.teardown();
    const inputsAfter = document.querySelectorAll('input[type=file]');
    expect(inputsAfter.length).toBeLessThan(inputsBefore.length);
    expect(browser['uploadService'].removeBrowse).toHaveBeenCalled();
  });
});
