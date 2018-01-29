import fileUploadErrorReducer from '../fileUploadError';
import { fileUploadError } from '../../actions/fileUploadError';
import { View, State } from '../../domain';

describe('fileUploadError() reducer', () => {
  const state = {
    view: {
      hasError: false,
    } as View,
  } as State;

  const createMockFileUploadError = () => (
    fileUploadError({
      file: {
        id: '',
        name: '',
        size: 1111111,
        creationDate: 111111,
        type: '',
      },
      error: {
        name: 'upload_fail',
        description: "couldnt upload file"
      }
    })
  );

  it('should return original state if action is unknown', () => {
    const action = {
      type: 'foobar',
    };

    const newState = fileUploadErrorReducer(state, action);

    expect(newState.view.hasError).to.be.equal(false);
  });

  it('should change hasError to true if there is a file upload error', () => {
    const action = createMockFileUploadError()

    const newState = fileUploadErrorReducer(state, action);

    expect(newState.view.hasError).to.be.equal(true);
  });
});