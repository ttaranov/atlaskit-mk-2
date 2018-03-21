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
      fileDetails: {
        status: 'PENDING',
      },
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows a viewer when a file was loaded successfully', () => {
    const model: Model = {
      fileDetails: {
        status: 'SUCCESSFUL',
        data: fileDetails,
      },
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    const fv = el.find(FileViewer);
    expect(fv).toHaveLength(1);
    expect(fv.props().fileDetails).toEqual(fileDetails);
  });

  it('shows an error on failure', () => {
    const model: Model = {
      fileDetails: {
        status: 'FAILED',
        err: new Error('something went wrong'),
      },
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });
});
