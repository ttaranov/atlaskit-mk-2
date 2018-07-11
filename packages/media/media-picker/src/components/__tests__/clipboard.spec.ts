import { ContextFactory } from '@atlaskit/media-core';
import { MediaPickerContext } from '../../domain/context';
import { UserEvent } from '../../outer/analytics/events';
import { MockClipboardEvent, MockFile } from '../../util/clipboardEventMocks';
import { Clipboard, getFilesFromClipboard } from '../clipboard';
import { UploadService } from '../../service/uploadServiceFactory';

jest.mock('../../service/uploadServiceFactory');

class MockContext implements MediaPickerContext {
  trackEvent(event: UserEvent) {}
}

describe('Clipboard', () => {
  let clipboard: Clipboard;
  let addFiles: any;
  const context = ContextFactory.create({
    serviceHost: '',
    authProvider: {} as any,
  });

  beforeEach(done => {
    clipboard = new Clipboard(new MockContext(), context);
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

  it('should append timestamp to clipboard image files', () => {
    const imageFile = new MockFile({ type: 'image/png', name: 'me.jpg' });
    document.dispatchEvent(
      new MockClipboardEvent('paste', [imageFile, new MockFile()]),
    );
    expect(addFiles).toHaveBeenCalledTimes(1);
    expect(addFiles.mock.calls[0][0][0].name).toEqual('me-19700101-000001.jpg');
    expect(addFiles.mock.calls[0][0][1].name).toEqual('some-file.png');
  });

  describe('getFilesFromClipboard', () => {
    it('should override file name for image files', () => {
      const fileList = [
        {
          type: 'image/png',
          name: 'my-image',
          lastModified: 123,
        },
        {
          type: 'text/plain',
          name: 'doc.txt',
          lastModified: 1,
        },
      ] as any;

      const files = getFilesFromClipboard(fileList);

      expect(files[0].name).toEqual('my-image-19700101-000000');
      expect(files[0].type).toEqual('image/png');
      expect(files[1].name).toEqual('doc.txt');
      expect(files[1].type).toEqual('text/plain');
      expect(files[1].lastModified).toEqual(1);
    });
  });
});
