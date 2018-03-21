import * as React from 'react';
import { mount } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import { MediaViewerRenderer } from '../../src/newgen/media-viewer-renderer';
import { Model, FileDetails } from '../../src/newgen/domain';
import { FileViewer } from '../../src/newgen/file-viewer';
import { ErrorMessage } from '../../src/newgen/styled';

describe('<MediaViewerRenderer />', () => {
  const fileDetails: FileDetails = { mediaType: 'doc' };
  it('shows an indicator while loading', () => {
    const model: Model = {
      type: 'LOADING',
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows a viewer when a file was loaded successfully', () => {
    const model: Model = {
      type: 'SUCCESS',
      item: fileDetails,
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(FileViewer)).toHaveLength(1);
  });

  it('shows an error on failure', () => {
    const model: Model = {
      type: 'FAILED',
      err: new Error('something went wrong'),
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });
});
