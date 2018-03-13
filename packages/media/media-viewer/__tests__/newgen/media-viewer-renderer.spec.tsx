import * as React from 'react';
import { mount } from 'enzyme';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import Spinner from '@atlaskit/spinner';
import {
  MediaViewerRenderer
} from '../../src/newgen/media-viewer-renderer';
import { RendererModel, FileDetails } from '../../src/newgen/domain';
import { FileViewer } from '../../src/newgen/file-viewer';
import { ErrorMessage } from '../../src/newgen/styled';

describe('<MediaViewerRenderer />', () => {
  const fileDetails: FileDetails = { mediaType: 'doc' };
  it('shows a loading indicator when loading', () => {
    const model: RendererModel = {
      type: 'LOADING'
    }
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows a viewer for file details', () => {
    const model: RendererModel = {
      type: 'SUCCESS',
      item: fileDetails
    }
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(FileViewer)).toHaveLength(1);
  });

  it('shows an error', () => {
    const model: RendererModel = {
      type: 'FAILED',
      err: new Error('error')
    }
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });

  // it('renders an error for a data source without file details', () => {
  //   // this may happen in the following scenario:
  //   // - user "a" inserts the file into the collection
  //   // - user "b" renders filmstrip
  //   // - user "a" deletes the file from the collection
  //   // - user "b" clicks on the filmstrip and opens MediaViewer,
  //   // which will fail to open that item
  //   const dataSource: DataSource = Observable.of(null);
  //   const el = mount(
  //     <MediaViewerRenderer dataSource={dataSource} />
  //   );
  //   expect(el.find(FileViewer)).toHaveLength(0);
  //   expect(el.find(ErrorMessage)).toHaveLength(1);
  // });

  it.skip('unsubscribes when completed?');
  it.skip('resubscribes when componentDidChange');
});
