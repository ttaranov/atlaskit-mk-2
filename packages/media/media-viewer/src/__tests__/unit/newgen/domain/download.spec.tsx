import { shallow } from 'enzyme';
import Button from '@atlaskit/button';
import { ErrorFileState, ProcessingFailedState } from '@atlaskit/media-core';
import {
  createItemDownloader,
  renderDownloadButton,
} from '../../../../newgen/domain/download';
import { createContext } from '../../_stubs';

describe('download', () => {
  const processingFailedState: ProcessingFailedState = {
    status: 'failed-processing',
    id: 'some-id',
    name: 'some-name',
    size: 42,
    artifacts: {},
    mediaType: 'image',
    mimeType: 'some-mime-type',
  };

  const errorState: ErrorFileState = {
    status: 'error',
    id: 'some-id',
  };

  it('should taken name from file provided', () => {
    const context = createContext({});
    createItemDownloader(processingFailedState, context)();
    expect(context.file.downloadBinary).toHaveBeenCalledWith(
      'some-id',
      'some-name',
      undefined,
    );
  });

  it('should not try to taken name from errored file provided', () => {
    const context = createContext({});
    createItemDownloader(errorState, context)();
    expect(context.file.downloadBinary).toHaveBeenCalledWith(
      'some-id',
      undefined,
      undefined,
    );
  });

  it('should pass collection name', () => {
    const context = createContext({});
    createItemDownloader(
      processingFailedState,
      context,
      'some-collection-name',
    )();
    expect(context.file.downloadBinary).toHaveBeenCalledWith(
      'some-id',
      'some-name',
      'some-collection-name',
    );
  });

  it('should download binary when button is clicked', () => {
    const context = createContext({});
    const component = shallow(
      renderDownloadButton(
        processingFailedState,
        context,
        'some-collection-name',
      ),
    );
    component.find(Button).simulate('click');
    expect(context.file.downloadBinary).toHaveBeenCalledWith(
      'some-id',
      'some-name',
      'some-collection-name',
    );
  });
});
