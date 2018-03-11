import { AuthProvider } from '@atlaskit/media-core';
import { Browser } from '../browser';
import { MediaPickerContext } from '../../domain/context';
import { UserEvent } from '../../outer/analytics/events';
import { ModuleConfig, UploadParams } from '../../domain/config';

class MockContext implements MediaPickerContext {
  trackEvent(event: UserEvent) {}
}

class MockConfig implements ModuleConfig {
  apiUrl: string;
  authProvider: AuthProvider;
  uploadParams?: UploadParams;
}

describe('Browser', () => {
  let browser: Browser | undefined;

  afterEach(() => {
    if (browser) {
      browser.teardown();
      browser = undefined;
    }
  });

  it('should append the input to the body', () => {
    const inputsBefore = document.querySelectorAll('input[type=file]');
    browser = new Browser(new MockContext(), new MockConfig());
    const inputsAfter = document.querySelectorAll('input[type=file]');
    expect(inputsAfter.length).toBeGreaterThan(inputsBefore.length);
  });

  it('should remove the input from the body', () => {
    browser = new Browser(new MockContext(), new MockConfig());
    const inputsBefore = document.querySelectorAll('input[type=file]');
    browser.teardown();
    const inputsAfter = document.querySelectorAll('input[type=file]');
    expect(inputsAfter.length).toBeLessThan(inputsBefore.length);
  });
});
