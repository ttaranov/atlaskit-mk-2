import { shallow, mount } from 'enzyme';
import * as React from 'react';
import { FlagGroup } from '@atlaskit/flag';

import { State } from '../../../../domain';
import {
  mockStore,
  mockState,
  mockContext,
  getComponentClassWithStore,
  mockIsWebGLNotAvailable,
} from '../../../../mocks';

mockIsWebGLNotAvailable(); // mock WebGL fail check before StatelessUploadView is imported
import { isWebGLAvailable } from '../../../../tools/webgl';
import { StatelessUploadView, default as ConnectedUploadView } from '../upload';
import { fileClick } from '../../../../actions/fileClick';
import { editorShowImage } from '../../../../actions/editorShowImage';
import { editRemoteImage } from '../../../../actions/editRemoteImage';

// tslint:disable-next-line:variable-name
const ConnectedUploadViewWithStore = getComponentClassWithStore(
  ConnectedUploadView,
);

const createConnectedComponent = (
  state: State,
  enzymeMethod: Function = shallow,
) => {
  const context = mockContext();
  const store = mockStore(state);
  const dispatch = store.dispatch;
  const root = enzymeMethod(
    <ConnectedUploadViewWithStore
      store={store}
      mpBrowser={{} as any}
      context={context}
      recentsCollection="some-collection-name"
    />,
  );
  const component = root.find(StatelessUploadView);
  return { component, dispatch, root };
};

describe('<StatelessUploadView />', () => {
  // Tests for stateless part
});

describe('<UploadView />', () => {
  let state: State;
  beforeEach(() => {
    state = {
      ...mockState,
      recents: {
        ...mockState.recents,
        items: [
          {
            type: 'some-type',
            id: 'some-id',
            insertedAt: 0,
            occurrenceKey: 'some-occurrence-key',
            details: {
              name: 'some-name',
              size: 100,
            },
          },
        ],
      },
      view: {
        ...mockState.view,
        hasPopupBeenVisible: true,
      },
      uploads: {
        'some-id': {
          file: {
            metadata: {
              id: 'some-id',
              name: 'some-name',
              size: 1000,
              mimeType: 'image/png',
            },
            dataURI: 'some-data-uri',
          },
          index: 0,
          events: [],
          tenant: {
            auth: {
              clientId: 'some-tenant-client-id',
              token: 'some-tenant-client-token',
            },
            uploadParams: {},
          },
          progress: 0,
        },
      },
    };
  });

  it('should deliver all required props to stateless component', () => {
    const { component } = createConnectedComponent(state);
    const props = component.props();
    expect(props.recents).toEqual(state.recents);
    expect(props.uploads).toEqual(state.uploads);
    expect(props.selectedItems).toEqual(state.selectedItems);
    expect(props.apiUrl).toEqual(state.apiUrl);
    expect(props.hasPopupBeenVisible).toEqual(state.view.hasPopupBeenVisible);
  });

  it('should dispatch fileClick action when onFileClick called', () => {
    const { component, dispatch } = createConnectedComponent(state);
    const props = component.props();
    const metadata = {
      id: 'some-id',
      mimeType: 'some-mime-type',
      name: 'some-name',
      size: 42,
    };
    props.onFileClick(metadata, 'google');
    expect(dispatch).toBeCalledWith(
      fileClick(
        {
          id: 'some-id',
          mimeType: 'some-mime-type',
          name: 'some-name',
          size: 42,
          date: 0,
          parentId: '',
        },
        'google',
      ),
    );
  });

  it('should dispatch editorShowImage action when onEditorShowImage called', () => {
    const { component, dispatch } = createConnectedComponent(state);
    const props = component.props();
    const fileRef = { id: 'some-id', name: 'some-name' };
    const dataUri = 'some-data-uri';

    props.onEditorShowImage(fileRef, dataUri);
    expect(dispatch).toHaveBeenCalledWith(editorShowImage(dataUri, fileRef));
  });

  it('should dispatch editRemoteImage action when onEditRemoteImage called', () => {
    const { component, dispatch } = createConnectedComponent(state);
    const props = component.props();
    const fileRef = { id: 'some-id', name: 'some-name' };
    const collectionName = 'some-collection-name';

    props.onEditRemoteImage(fileRef, collectionName);
    expect(dispatch).toHaveBeenCalledWith(
      editRemoteImage(fileRef, collectionName),
    );
  });

  it('should display a flag if WebGL is not available', () => {
    const { component, root } = createConnectedComponent(state, mount);
    const mockAnnotationClick = component
      .instance()
      .onAnnotateActionClick(() => {});

    root.update();

    expect(isWebGLAvailable).not.toHaveBeenCalled();
    expect(root.find(FlagGroup)).toHaveLength(0);
    mockAnnotationClick();

    root.update();

    expect(root.find(FlagGroup)).toHaveLength(1);
    expect(isWebGLAvailable).toHaveBeenCalled();
  });
});
