declare var global: any;

import getImagePreview from './getImagePreview';

describe('getImagePreview helper method', () => {
  const img = {
    width: 5,
    height: 5,
    onload: jest.fn(),
    onerror: jest.fn(),
    src: '',
  };
  const someImgSource = 'some-img';
  let createObjectURLMock: jest.Mock<any>;
  const file = new File([''], 'file.png');

  beforeEach(() => {
    const imageConstructorMock = jest.fn();
    createObjectURLMock = jest.fn(() => undefined);

    imageConstructorMock.mockImplementation(() => img);
    createObjectURLMock.mockReturnValue(someImgSource);
    global.Image = imageConstructorMock;
    global.URL.createObjectURL = createObjectURLMock;
  });

  afterAll(() => {
    delete global.Image;
    jest.resetAllMocks();
  });

  it('should return the img dimensions', () => {
    const promise = getImagePreview(file);
    img.onload();

    return expect(promise).resolves.toMatchObject(
      expect.objectContaining({ width: 5, height: 5 }),
    );
  });

  it('should call creaObjectURL with file', () => {
    const promise = getImagePreview(file);
    img.onload();

    return promise.then(() => {
      expect(createObjectURLMock).toBeCalledWith(file);
    });
  });

  it('should return error if image failed to load', () => {
    const promise = getImagePreview(file);
    img.onerror(new Error('some error'));

    return expect(promise).rejects.toBeInstanceOf(Error);
  });

  it('should return an image with right source', () => {
    const promise = getImagePreview(file);
    img.onload();

    return promise.then(() => {
      expect(img.src).toEqual(someImgSource);
    });
  });

  it('should return the image source', () => {
    const promise = getImagePreview(file);
    img.onload();

    return expect(promise).resolves.toMatchObject(
      expect.objectContaining({ src: someImgSource }),
    );
  });
});
