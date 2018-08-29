import { shallow, mount } from 'enzyme';
import * as React from 'react';
import Spinner from '@atlaskit/spinner';
import { FlagGroup } from '@atlaskit/flag';
import { FileDetails } from '@atlaskit/media-core';
import { Card, CardView } from '@atlaskit/media-card';
import AnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import { fakeContext } from '@atlaskit/media-test-helpers';
import {
  State,
  CollectionItem,
  SelectedItem,
  LocalUpload,
} from '../../../../../domain';
import {
  mockStore,
  mockState,
  getComponentClassWithStore,
  mockIsWebGLNotAvailable,
} from '../../../../../mocks';

mockIsWebGLNotAvailable(); // mock WebGL fail check before StatelessUploadView is imported
import { isWebGLAvailable } from '../../../../../tools/webgl';
import {
  StatelessUploadView,
  default as ConnectedUploadView,
} from '../../upload';
import { fileClick } from '../../../../../actions/fileClick';
import { editorShowImage } from '../../../../../actions/editorShowImage';
import { editRemoteImage } from '../../../../../actions/editRemoteImage';

import { Dropzone } from '../../dropzone';

import { SpinnerWrapper, Wrapper } from '../../styled';

const ConnectedUploadViewWithStore = getComponentClassWithStore(
  ConnectedUploadView,
);

const createConnectedComponent = (
  state: State,
  enzymeMethod: Function = shallow,
) => {
  const context = fakeContext();
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
  const getUploadViewElement = (
    isLoading: boolean,
    recentItems: CollectionItem[] = [],
    mockStateOverride: Partial<State> = {},
  ) => {
    const context = fakeContext();

    const { selectedItems, uploads } = {
      ...mockState,
      ...mockStateOverride,
    } as State;

    const recents = {
      items: recentItems,
      nextKey: '',
    };
    const setUpfrontIdDeferred = jest.fn();

    return (
      <StatelessUploadView
        mpBrowser={{} as any}
        context={context}
        recentsCollection="some-collection-name"
        isLoading={isLoading}
        recents={recents}
        uploads={uploads}
        selectedItems={selectedItems}
        onFileClick={() => {}}
        onEditorShowImage={() => {}}
        onEditRemoteImage={() => {}}
        setUpfrontIdDeferred={setUpfrontIdDeferred}
      />
    );
  };

  it('should render the loading state when "isLoading" is true', () => {
    const component = shallow(getUploadViewElement(true));

    expect(component.find(SpinnerWrapper)).toHaveLength(1);
    expect(component.find(Spinner)).toHaveLength(1);
  });

  it('should render the empty state when there are NO recent items and NO local uploads inflight', () => {
    const component = shallow(getUploadViewElement(false));

    expect(component.find(Wrapper)).toHaveLength(1);
    expect(component.find(Dropzone)).toHaveLength(1);
    expect(component.find(Dropzone).props().isEmpty).toEqual(true);
  });

  it('should render cards and dropzone when there are recent items', () => {
    const recentItem = {
      type: 'file',
      id: 'some-file-id',
      insertedAt: 0,
      occurrenceKey: 'some-occurrence-key',
      details: { name: 'some-file-name', size: 1000 },
    };
    const recentItems = [recentItem, recentItem, recentItem];

    const component = shallow(getUploadViewElement(false, recentItems));

    expect(component.find(Wrapper)).toHaveLength(1);
    expect(component.find(Dropzone)).toHaveLength(1);
    expect(component.find(Dropzone).props().isEmpty).toEqual(false);

    expect(component.find(Card)).toHaveLength(3);
  });

  it('should render currently uploading items', () => {
    const mockStateOverride: Partial<State> = {
      uploads: {
        uploadId1: {
          file: {
            metadata: {
              id: 'id1',
              mimeType: 'image/jpeg',
              name: 'some-file-name',
              size: 42,
            },
          },
          progress: 10,
        } as LocalUpload,
      },
      selectedItems: [
        {
          id: 'id1',
          serviceName: 'upload',
        },
      ] as SelectedItem[],
    };
    const expectedMetadata: FileDetails = {
      id: 'id1',
      name: 'some-file-name',
      size: 42,
      mediaType: 'image',
      mimeType: 'image/jpeg',
    };
    const component = shallow(
      getUploadViewElement(false, [], mockStateOverride),
    );
    expect(component.find(CardView)).toHaveLength(1);
    expect(component.find(CardView).props().metadata).toEqual(expectedMetadata);
    expect(component.find(CardView).props().status).toEqual('uploading');
    expect(component.find(CardView).props().progress).toEqual(10);
    expect(component.find(CardView).props().dimensions).toEqual({
      width: 162,
      height: 108,
    });
    expect(component.find(CardView).props().selectable).toEqual(true);
    expect(component.find(CardView).props().selected).toEqual(true);
  });

  it('should render right mediaType for uploading files', () => {
    const mockStateOverride: Partial<State> = {
      uploads: {
        uploadId1: {
          file: {
            metadata: {
              id: 'id1',
              mimeType: 'video/mp4',
            },
          },
        } as LocalUpload,
        uploadId2: {
          file: {
            metadata: {
              id: 'id1',
              mimeType: 'application/pdf',
            },
          },
        } as LocalUpload,
      },
    };
    const component = shallow(
      getUploadViewElement(false, [], mockStateOverride),
    );
    expect(component.find(CardView)).toHaveLength(2);
    expect(
      component
        .find(CardView)
        .first()
        .props().metadata,
    ).toEqual(
      expect.objectContaining({
        mediaType: 'video',
        mimeType: 'video/mp4',
      }),
    );
    expect(
      component
        .find(CardView)
        .last()
        .props().metadata,
    ).toEqual(
      expect.objectContaining({
        mediaType: 'doc',
        mimeType: 'application/pdf',
      }),
    );
  });
});

describe('<UploadView />', () => {
  let state: State;
  const upfrontId = Promise.resolve('');
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
      },
      uploads: {
        'some-id': {
          file: {
            metadata: {
              id: 'some-id',
              name: 'some-name',
              size: 1000,
              mimeType: 'image/png',
              upfrontId,
            },
            dataURI: 'some-data-uri',
            // upfrontId
          },
          index: 0,
          events: [],
          tenant: {
            auth: {
              clientId: 'some-tenant-client-id',
              token: 'some-tenant-client-token',
              baseUrl: 'some-base-url',
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
  });

  it('should dispatch fileClick action when onFileClick called', () => {
    const { component, dispatch } = createConnectedComponent(state);
    const props = component.props();
    const metadata = {
      id: 'some-id',
      mimeType: 'some-mime-type',
      name: 'some-name',
      size: 42,
      upfrontId,
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
          upfrontId,
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

  it('should render annotate card action with annotate icon', () => {
    const { component } = createConnectedComponent(state, mount);
    expect(
      component
        .find(CardView)
        .first()
        .props().actions,
    ).toContainEqual({
      label: 'Annotate',
      icon: expect.objectContaining({
        type: AnnotateIcon,
      }),
      handler: expect.any(Function),
    });
  });

  it('should set deferred upfront id when clicking on a card', () => {
    const { component, dispatch } = createConnectedComponent(state, mount);

    component
      .find('Card')
      .first()
      .props()
      .onClick({ mediaItemDetails: { id: 'some-id' } });
    expect(dispatch.mock.calls[0][0]).toEqual({
      id: 'some-id',
      type: 'SET_UPFRONT_ID_DEFERRED',
      resolver: expect.anything(),
      rejecter: expect.anything(),
    });
  });
});
