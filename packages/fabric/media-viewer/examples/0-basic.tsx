import { MediaViewer } from '../src';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import MediaViewerConstructor from '@atlassian/mediaviewer/lib/mediaviewer.all';

const context = createStorybookContext();
const selectedItem = {
  id: 'ea994991-9319-487b-b92a-fdfb8d982e36',
  occurrenceKey: '',
  type: 'file',
};
const dataSource = {
  collectionName: defaultCollectionName,
};
const basePath = 'dist/lib/';

export default () => (
  <MediaViewer
    context={context}
    selectedItem={selectedItem}
    dataSource={dataSource}
    collectionName={defaultCollectionName}
    MediaViewer={MediaViewerConstructor}
    basePath={basePath}
  />
);
