import * as React from 'react';
import { mount } from 'enzyme';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import Spinner from '@atlaskit/spinner';
import {
  MediaViewerRenderer,
  DataSource,
} from '../../src/newgen/media-viewer-renderer';
import { FileViewer, FileDetails } from '../../src/newgen/file-viewer';
import { ErrorMessage } from '../../src/newgen/styled';

describe('<MediaViewerRenderer />', () => {
  it('shows a loading indicator while no data has been emitted yet', () => {
    const fileDetails: FileDetails = { mediaType: 'doc' };
    const dataSource: DataSource = Observable.never();
    const el = mount(<MediaViewerRenderer dataSource={dataSource} />);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows a viewer for a data source with file details', () => {
    const fileDetails: FileDetails = { mediaType: 'doc' };
    const dataSource: DataSource = Observable.of(fileDetails);
    const el = mount(<MediaViewerRenderer dataSource={dataSource} />);
    expect(el.find(FileViewer)).toHaveLength(1);
  });

  it('shows an error if the data source emits an error event', () => {
    const fileDetails: FileDetails = { mediaType: 'doc' };
    const dataSource: DataSource = Observable.throw(
      new Error('no items provided'),
    );
    const el = mount(<MediaViewerRenderer dataSource={dataSource} />);
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
