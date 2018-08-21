declare var global: any;
jest.mock('video-snapshot');
import VideoSnapshot from 'video-snapshot';
import { getPreviewFromVideo } from '../../getPreviewFromVideo';

describe('getPreviewFromVideo util', () => {
  const setup = () => {
    const snapshotSrc = 'snapshot-src';
    const snapshotPromise = Promise.resolve(snapshotSrc);
    const takeSnapshotMock = jest.fn().mockReturnValue(snapshotPromise);
    const endMock = jest.fn();
    (VideoSnapshot as any).mockImplementation(() => ({
      takeSnapshot: takeSnapshotMock,
      end: endMock,
    }));
    const img = {
      width: 5,
      height: 5,
      onload: jest.fn(),
      onerror: jest.fn(),
      src: '',
    };
    const imageConstructorMock = jest.fn();
    const file = new File([''], 'video.mp4');

    imageConstructorMock.mockImplementation(() => img);
    global.Image = imageConstructorMock;

    return {
      snapshotPromise,
      img,
      file,
      endMock,
    };
  };

  it('should return an image preview out of a video file', async () => {
    const { file, snapshotPromise, endMock, img } = setup();
    const previewPromise = getPreviewFromVideo(file);
    await snapshotPromise;

    img.onload();

    return previewPromise.then(preview => {
      expect(endMock).toHaveBeenCalledTimes(1);
      expect(preview.src).toEqual('snapshot-src');
      expect(preview.dimensions).toEqual({ width: 5, height: 5 });
    });
  });
});
