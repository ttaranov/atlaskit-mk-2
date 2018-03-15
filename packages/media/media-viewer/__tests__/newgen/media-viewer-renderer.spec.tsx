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

  it('renders a viewer for a list with one center item', () => {
    const fileDetails: FileDetails = { mediaType: 'doc' };
    const dataSource: DataSource = {
      left: [],
      center: fileDetails,
      right: []
    };
    const el = mount(
      <MediaViewerRenderer dataSource={Observable.of(dataSource)} />
    );
    expect(el.find(FileViewer)).toHaveLength(1);
  });

  it('renders a viewer for a list with more than one item when there are more items in the left hand side', () => {
    const dataSource: DataSource = {
      left: [{ mediaType: 'unknown' }],
      center: { mediaType: 'doc' },
      right: []
    };
    const el = mount(
      <MediaViewerRenderer dataSource={Observable.of(dataSource)} />
    );
    const fv = el.find(FileViewer);
    expect(fv).toHaveLength(1);
    expect(fv.props().fileDetails).toEqual({ mediaType: 'doc' });
  });

  it('renders a viewer for the center item when there are more items on the right hand side', () => {
    const dataSource: DataSource = {
      left: [],
      center: { mediaType: 'unknown' },
      right: [{ mediaType: 'doc' }]
    };
    const el = mount(
      <MediaViewerRenderer dataSource={Observable.of(dataSource)} />
    );
    const fv = el.find(FileViewer);
    expect(fv).toHaveLength(1);
    expect(fv.props().fileDetails).toEqual({ mediaType: 'unknown' });
  });

  it.skip('updates when next is emitted');
  it.skip('handles errors correctly');
  it.skip('unsubscribes when completed?');
  it.skip('resubscribes when componentDidChange');
});

// it('renders an error for an empty list', () => {
//   // this may happen in the following scenario:
//   // - user "a" inserts the file into the collection
//   // - user "b" renders filmstrip
//   // - user "a" deletes the file from the collection
//   // - user "b" clicks on the filmstrip and opens MediaViewer,
//   // which will fail to open that item
//   const dataSource: DataSource = {
//     left: [],
//     center:
//   }
//   const el = mount(
//     <MediaViewerRenderer dataSource={Observable.of(dataSource)} />
//   );
//   expect(el.find(FileViewer)).toHaveLength(0);
//   expect(el.find(ErrorMessage)).toHaveLength(1);
// });

