import * as React from 'react';
import { mount } from 'enzyme';
import {
  MediaViewerRenderer,
  DataSource,
} from '../../src/newgen/media-viewer-renderer';

import { FileViewer } from '../../src/newgen/file-viewer';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

describe('<MediaViewerRenderer />', () => {
  it('renders a viewer for a list with one fileDetails object', () => {
    const fileDetails = { mediaType: 'doc' };
    const dataSource: DataSource = Observable.of([fileDetails]);
    const el = mount(
      <MediaViewerRenderer dataSource={dataSource} />
    );
    expect(el.find(FileViewer)).toHaveLength(1);
  });

  it.skip('updates when next is emitted');
  it.skip('handles errors correctly');
  it.skip('unsubscribes when completed?');
  it.skip('resubscribes when componentDidChange');
  it.skip('renders an error when there are no iems');
  it.skip('renders one of many items');
});
