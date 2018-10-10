jest.mock('video-snapshot', () => {
  class FakeVideoSnapshot {
    takeSnapshot() {
      return 'video-preview';
    }
    end() {}
  }
  return {
    default: FakeVideoSnapshot,
  };
});
import { getDataURIFromFileState } from '../../getDataURIFromFileState';

describe('getDataURIFromFileState()', () => {
  it('should not work for error state', async () => {
    const dataURI = await getDataURIFromFileState({
      status: 'error',
      id: '1',
    });

    expect(dataURI).toBeUndefined();
  });

  it('should not work for non previewable types', async () => {
    const dataURI = await getDataURIFromFileState({
      status: 'processing',
      id: '1',
      name: '',
      size: 1,
      mediaType: 'doc',
      mimeType: 'application/pdf',
      preview: {
        blob: new File([], 'filename', { type: 'text/plain' }),
      },
    });

    expect(dataURI).toBeUndefined();
  });

  it('should return data uri for images', async () => {
    const dataURI = await getDataURIFromFileState({
      status: 'uploading',
      id: '1',
      name: '',
      size: 1,
      progress: 0.5,
      mediaType: 'image',
      mimeType: 'image/jpg',
      preview: {
        blob: new File([], 'filename', { type: 'image/png' }),
      },
    });

    expect(dataURI).toEqual('mock result of URL.createObjectURL()');
  });

  it('should return data uri for videos', async () => {
    const dataURI = await getDataURIFromFileState({
      status: 'processed',
      id: '1',
      name: '',
      size: 1,
      mediaType: 'image',
      mimeType: 'image/png',
      preview: {
        blob: new File([], 'filename', { type: 'video/mov' }),
      },
      artifacts: {},
    });

    expect(dataURI).toEqual('video-preview');
  });
});
