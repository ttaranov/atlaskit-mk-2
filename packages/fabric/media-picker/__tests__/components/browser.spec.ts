import { AuthProvider, UploadParams } from '@atlaskit/media-core';
import { Browser } from '../../src/components/browser';
import { MediaPickerContext } from '../../src/domain/context';
import { UserEvent } from '../../src/outer/analytics/events';
import { ModuleConfig } from '../../src/domain/config';

class MockContext implements MediaPickerContext {
  trackEvent(event: UserEvent) {}
}

class MockConfig implements ModuleConfig {
  apiUrl: string;
  authProvider: AuthProvider;
  uploadParams?: UploadParams;
}

describe('Browser', () => {
  let browser: Browser;

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
