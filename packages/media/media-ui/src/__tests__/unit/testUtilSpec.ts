declare var global: any;

import {
  dataURItoFile,
  fileToArrayBuffer,
  fileToDataURI,
  getFileInfo,
  loadImage,
} from '../../util';

const tinyPngDataURI = 'data:image/png;base64,';
const smallPngDataURI =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAA6ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxOC0wOS0xOFQxMzowOTowNzwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+UGl4ZWxtYXRvciAzLjcuNDwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj4wPC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Coc2xwQAAAAMSURBVAgdY/ivxgAAA00BJkNtnZwAAAAASUVORK5CYII=';
const tinyBadDataURI = 'very-bad-data';

describe('Image Meta Data Util', () => {
  const tinyPngFile = dataURItoFile(tinyPngDataURI);

  describe('convert between dataURI and File', () => {
    it('should convert dataURI to File', () => {
      expect(tinyPngFile).toBeInstanceOf(File);
    });

    it('should preserve mimeType', () => {
      expect(tinyPngFile.type).toEqual('image/png');
    });

    it('should convert File to dataURI', async () => {
      const dataURI = await fileToDataURI(tinyPngFile);
      expect(dataURI).toEqual(tinyPngDataURI);
    });

    it('should still convert bad dataURI to File', () => {
      const file = dataURItoFile(tinyBadDataURI);
      expect(file).toBeInstanceOf(File);
    });

    it('should still convert invalid File to dataURI', async () => {
      const badFile = new File([], 'filename', { type: 'bad/type' });
      const dataURI = await fileToDataURI(badFile);
      expect(typeof dataURI).toBe('string');
    });

    it('should throw message on empty dataURI', () => {
      expect(() => dataURItoFile('')).toThrowError('dataURI not found');
    });
  });

  describe('fileToArrayBuffer', () => {
    const file = dataURItoFile(smallPngDataURI);

    it('should return a Uint8Array with data from a file with data', async () => {
      const array = await fileToArrayBuffer(file);
      expect(array).toBeInstanceOf(Uint8Array);
      expect(array.length).toBeGreaterThan(0);
    });

    it('should return an empty array from an empty file', async () => {
      const emptyFile = new File([], 'some-filename', { type: 'some-type' });
      const array = await fileToArrayBuffer(emptyFile);
      expect(array).toHaveLength(0);
    });
  });

  describe('getFileInfo', () => {
    it('should return a FileInfo structure with src when passed a File', async () => {
      const fileInfo = await getFileInfo(tinyPngFile);
      const dataURI = await fileToDataURI(tinyPngFile);
      expect(fileInfo.file).toEqual(tinyPngFile);
      expect(fileInfo.src).toEqual(dataURI);
    });

    it('should use passed src instead of generating', async () => {
      const fileInfo = await getFileInfo(tinyPngFile, 'some-dataURI');
      expect(fileInfo.file).toEqual(tinyPngFile);
      expect(fileInfo.src).toEqual('some-dataURI');
    });
  });

  describe('loadImage', () => {
    let globalImage: any;

    beforeEach(() => {
      class MockImage extends global.Image {
        constructor() {
          super();
          setImmediate(() => this.onload());
        }
      }
      global.Image = MockImage;
    });

    afterEach(() => {
      global.Image = globalImage;
    });

    it('should return an image async', async () => {
      const img = await loadImage(tinyPngDataURI);
      expect(img).toBeInstanceOf(HTMLImageElement);
      expect(img.src).toEqual(tinyPngDataURI);
    });
  });
});
