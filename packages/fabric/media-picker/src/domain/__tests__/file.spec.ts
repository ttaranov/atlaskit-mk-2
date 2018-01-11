jest.mock('../../util/handleError', () => ({
  handleError: jest.fn(),
}));

import { handleError } from '../../util/handleError';
import { validateMediaFile } from '../file';

describe('validateMediaFile', () => {
  const defaultFile = {
    id: 'some-file-id',
    name: 'some-file-name',
    size: 123,
    creationDate: Date.now(),
    type: 'image',
  };

  afterEach(() => jest.resetAllMocks());

  it('should not have error given id with more than 8 alphanumeric characters', () => {
    validateMediaFile({
      ...defaultFile,
      id: 'DamienKlinnertWroteThisOriginalTestlm7df4y9m5hp0eu4jp1g',
    });

    expect(handleError).not.toBeCalled();
  });

  it('should not have error given id with non-alphanumeric characters', () => {
    validateMediaFile({
      ...defaultFile,
      id: 'InRussianErrorWillBe"Ошибка"',
    });

    expect(handleError).not.toBeCalled();
  });

  it('should have error given empty id', () => {
    validateMediaFile({
      ...defaultFile,
      id: '',
    });

    expect(handleError).toBeCalledWith(
      'wrong_file_id',
      'Passed fileId is incorrect.',
    );
  });

  it('shold not have error given non-empty name', () => {
    validateMediaFile({
      ...defaultFile,
      name: 'Vasiliy',
    });

    expect(handleError).not.toBeCalled();
  });

  it('should not have error given empty name', () => {
    validateMediaFile({
      ...defaultFile,
      name: '',
    });

    expect(handleError).not.toBeCalled();
  });

  it('should not have error given non-empty type', () => {
    validateMediaFile({
      ...defaultFile,
      type: 'pdf',
    });

    expect(handleError).not.toBeCalled();
  });

  it('should not have error given positive or zero size', () => {
    validateMediaFile({
      ...defaultFile,
      size: 512,
    });

    validateMediaFile({
      ...defaultFile,
      size: 0,
    });

    expect(handleError).not.toBeCalled();
  });

  it('should have error given negative size', () => {
    validateMediaFile({
      ...defaultFile,
      size: -1,
    });

    expect(handleError).toBeCalledWith(
      'wrong_file_size',
      'Passed file size is incorrect.',
    );
  });

  it('should not have error given positive creationDate', () => {
    validateMediaFile({
      ...defaultFile,
      creationDate: 1461725059,
    });

    expect(handleError).not.toBeCalled();
  });

  it('should have error given zero creationDate', () => {
    validateMediaFile({
      ...defaultFile,
      creationDate: 0,
    });

    expect(handleError).toBeCalledWith(
      'wrong_file_date',
      'Passed file creation date is incorrect.',
    );
  });
});
