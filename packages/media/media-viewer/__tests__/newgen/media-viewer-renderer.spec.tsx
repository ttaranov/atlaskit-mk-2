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
      previewData: {
        status: 'PENDING'
      }
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows a viewer when file details were loaded successfully', () => {
    const model: Model = {
      fileDetails: {
        status: 'SUCCESSFUL',
        data: fileDetails,
      },
      previewData: {
        status: 'SUCCESSFUL',
        data: {
          viewer: 'IMAGE',
          objectUrl: ''
        }
      }
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    const fv = el.find(FileViewer);
    expect(fv).toHaveLength(1);
  });

  it('shows an error when preview failed to load', () => {
    const model: Model = {
      fileDetails: {
        status: 'SUCCESSFUL',
        data: fileDetails,
      },
      previewData: {
        status: 'FAILED',
        err: new Error('')
      }
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    const err = el.find(ErrorMessage);
    expect(err.text()).toContain('Error rendering preview');
  });

  it('shows a loading UI when preview is loading', () => {
    const model: Model = {
      fileDetails: {
        status: 'SUCCESSFUL',
        data: fileDetails,
      },
      previewData: {
        status: 'PENDING'
      }
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    const spinner = el.find(Spinner);
    expect(spinner).toHaveLength(1);
  });

  it('shows an error on failure', () => {
    const model: Model = {
      fileDetails: {
        status: 'FAILED',
        err: new Error('something went wrong'),
      },
      previewData: {
        status: 'PENDING'
      }
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });

  it('shows an error if file is unsupported', () => {
    const model: Model = {
      fileDetails: {
        status: 'SUCCESSFUL',
        data: {
          mediaType: 'unknown'
        }
      },
      previewData: {
        status: 'PENDING'
      }
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(ErrorMessage).text()).toContain('unsupported');
  });
});
