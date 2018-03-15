import * as React from 'react';
import { mount } from 'enzyme';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import {
  MediaViewerRenderer,
  DataSource,
} from '../../src/newgen/media-viewer-renderer';
import { FileViewer, FileDetails } from '../../src/newgen/file-viewer';
import { ErrorMessage } from '../../src/newgen/styled';

describe('<MediaViewerRenderer />', () => {

  it('renders a viewer for a datasource with file details', () => {
    const fileDetails: FileDetails = { mediaType: 'doc' };
    const dataSource: DataSource = Observable.of(fileDetails);
    const el = mount(
      <MediaViewerRenderer dataSource={dataSource} />
    );
    expect(el.find(FileViewer)).toHaveLength(1);
  });

  it('renders an error for a data source without file details', () => {
    // this may happen in the following scenario:
    // - user "a" inserts the file into the collection
    // - user "b" renders filmstrip
    // - user "a" deletes the file from the collection
    // - user "b" clicks on the filmstrip and opens MediaViewer,
    // which will fail to open that item
    const dataSource: DataSource = Observable.of(null);
    const el = mount(
      <MediaViewerRenderer dataSource={dataSource} />
    );
    expect(el.find(FileViewer)).toHaveLength(0);
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });

  it.skip('updates when next is emitted');
  it.skip('handles errors correctly');
  it.skip('unsubscribes when completed?');
  it.skip('resubscribes when componentDidChange');
});

