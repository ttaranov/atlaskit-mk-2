import { Auth, ContextFactory } from '@atlaskit/media-core';
import {
  MockClipboardEvent,
  MockFile,
} from '../../../util/clipboardEventMocks';
import { Clipboard } from '../../clipboard';
import { UploadService } from '../../../service/uploadServiceFactory';

jest.mock('../../../service/uploadServiceFactory');

describe('Clipboard', () => {
  let clipboard: Clipboard;
  let addFiles: any;
  const context = ContextFactory.create({
    authProvider: () =>
      Promise.resolve<Auth>({
        clientId: '',
        token: '',
        baseUrl: '',
      }),
  });

  beforeEach(done => {
    clipboard = new Clipboard(context);
    clipboard.activate();
    document.dispatchEvent(new Event('DOMContentLoaded'));

    addFiles = jest.fn();
    ((clipboard as any).uploadService as UploadService).addFiles = addFiles;

    // necessary for dom ready listener
    setTimeout(done, 0);
  });

  afterEach(() => {
    clipboard.deactivate();
  });

  it('should call this.uploadService.addFiles() when a paste event is dispatched with a single file', () => {
    document.dispatchEvent(new MockClipboardEvent('paste', [new MockFile()]));
    expect(addFiles).toHaveBeenCalledTimes(1);
  });

  it('should call this.uploadService.addFiles() when a paste event is dispatched with multiple files', () => {
    const files = [new MockFile(), new MockFile()];
    document.dispatchEvent(new MockClipboardEvent('paste', files));
    expect(addFiles).toHaveBeenCalledTimes(1);
    expect(addFiles).toHaveBeenCalledWith(files);
  });

  it('should not call this.uploadService.addFiles() when deactivated and a paste event is dispatched a single file', () => {
    clipboard.deactivate();
    document.dispatchEvent(new MockClipboardEvent('paste', [new MockFile()]));
    expect(addFiles).toHaveBeenCalledTimes(0);
  });

  it('should not trigger errors when event.clipboardData is undefined', () => {
    const event = new MockClipboardEvent('paste', [new MockFile()]);
    delete event.clipboardData;
    document.dispatchEvent(event);
    expect(addFiles).toHaveBeenCalledTimes(0);
  });
});
