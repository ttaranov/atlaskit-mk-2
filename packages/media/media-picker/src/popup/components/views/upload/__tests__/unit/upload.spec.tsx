import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import Spinner from '@atlaskit/spinner';
import { FlagGroup } from '@atlaskit/flag';
import { Card } from '@atlaskit/media-card';
import { MediaCollectionItem } from '@atlaskit/media-store';
import { fakeContext } from '@atlaskit/media-test-helpers';
import { Context } from '@atlaskit/media-core';
import { State, SelectedItem, LocalUpload } from '../../../../../domain';
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
import { LoadingNextPageWrapper } from '../../styled';
import { fileClick } from '../../../../../actions/fileClick';
import { editorShowImage } from '../../../../../actions/editorShowImage';
import { editRemoteImage } from '../../../../../actions/editRemoteImage';

import { Dropzone } from '../../dropzone';

import { SpinnerWrapper, Wrapper } from '../../styled';
import { LocalBrowserButton } from '../../../../views/upload/uploadButton';
import { Browser } from '../../../../../../components/browser';

const ConnectedUploadViewWithStore = getComponentClassWithStore(
  ConnectedUploadView,
);

const createConnectedComponent = (
  state: State,
  reactContext: {} = {},
  context: Context = fakeContext(),
) => {
  const store = mockStore(state);
  const dispatch = store.dispatch;
  const root = mount(
    <Provider store={store}>
      <ConnectedUploadViewWithStore
        mpBrowser={new Browser(context) as any}
        context={context}
        recentsCollection="some-collection-name"
      />
    </Provider>,
    {
      context: reactContext,
      childContextTypes: {
        getAtlaskitAnalyticsEventHandlers() {},
      },
    },
  );
  const component = root.find(StatelessUploadView);
  return { component, dispatch, root, context };
};

describe('<StatelessUploadView />', () => {
  const getUploadViewElement = (
    isLoading: boolean,
    recentItems: MediaCollectionItem[] = [],
    mockStateOverride: Partial<State> = {},
  ) => {
    const state: State = {
      ...mockState,
      ...mockStateOverride,
    } as State;
    const context = fakeContext();
    const store = mockStore(state);

    const { selectedItems, uploads } = state;

    const recents = {
      items: recentItems,
    };
    const setUpfrontIdDeferred = jest.fn();

    return (
      <Provider store={store}>
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
      </Provider>
    );
  };

  it('should render the loading state when "isLoading" is true', () => {
    const component = mount(getUploadViewElement(true));

    expect(component.find(SpinnerWrapper)).toHaveLength(1);
    expect(component.find(Spinner)).toHaveLength(1);
  });

  it('should render the empty state when there are NO recent items and NO local uploads inflight', () => {
    const component = mount(getUploadViewElement(false));

    expect(component.find(Wrapper)).toHaveLength(1);
    expect(component.find(Dropzone)).toHaveLength(1);
    expect(component.find(Dropzone).props().isEmpty).toEqual(true);
  });

  it('should render cards and dropzone when there are recent items', () => {
    const createRecentItem = (occurrenceKey: string): MediaCollectionItem => ({
      type: 'file',
      id: 'some-file-id',
      insertedAt: 0,
      occurrenceKey: `some-occurrence-key${occurrenceKey}`,
      details: { name: 'some-file-name', size: 1000 },
    });
    const recentItems = [
      createRecentItem('1'),
      createRecentItem('2'),
      createRecentItem('3'),
    ];

    const component = mount(getUploadViewElement(false, recentItems));

    expect(component.find(Wrapper)).toHaveLength(1);
    expect(component.find(Dropzone)).toHaveLength(1);
    expect(component.find(Dropzone).props().isEmpty).toEqual(false);

    expect(component.find(Card)).toHaveLength(3);
  });

  it('should render currently uploading items', () => {
    const upfrontId = Promise.resolve('id1');
    const mockStateOverride: Partial<State> = {
      uploads: {
        uploadId1: {
          file: {
            metadata: {
              id: 'id1',
              mimeType: 'image/jpeg',
              name: 'some-file-name',
              upfrontId,
            },
          },
        } as LocalUpload,
      },
      selectedItems: [
        {
          id: 'id1',
          serviceName: 'upload',
        },
      ] as SelectedItem[],
    };
    const component = mount(getUploadViewElement(false, [], mockStateOverride));

    expect(component.find(Card)).toHaveLength(1);
    expect(component.find(Card).prop('dimensions')).toEqual({
      width: 162,
      height: 108,
    });
    expect(component.find(Card).prop('selectable')).toEqual(true);
    expect(component.find(Card).prop('selected')).toEqual(true);
    expect(component.find(Card).prop('identifier')).toEqual({
      id: upfrontId,
      mediaItemType: 'file',
    });
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
            type: 'file',
            id: 'some-id',
            insertedAt: 0,
            occurrenceKey: 'some-occurrence-key',
            details: {
              name: 'some-name',
              size: 100,
            },
          } as MediaCollectionItem,
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
          timeStarted: 0,
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
    const { component, root } = createConnectedComponent(state);
    const mockAnnotationClick = (component.instance() as StatelessUploadView).onAnnotateActionClick(
      () => {},
    );

    root.update();

    expect(isWebGLAvailable).not.toHaveBeenCalled();
    expect(root.find(FlagGroup)).toHaveLength(0);
    mockAnnotationClick();

    root.update();

    expect(root.find(FlagGroup)).toHaveLength(1);
    expect(isWebGLAvailable).toHaveBeenCalled();
  });

  it('should set deferred upfront id when clicking on a card', () => {
    const { component, dispatch } = createConnectedComponent(state);

    const props = component
      .find(Card)
      .last()
      .props();
    if (props.onClick) {
      props.onClick({ mediaItemDetails: { id: 'some-id' } } as any);
    } else {
      fail('onClick property is missing in props');
    }

    expect(dispatch.mock.calls[0][0]).toEqual({
      id: 'some-id',
      type: 'SET_UPFRONT_ID_DEFERRED',
      resolver: expect.anything(),
      rejecter: expect.anything(),
    });
  });

  it('should fire an analytics event when given a react context', () => {
    const aHandler = jest.fn();

    const { component } = createConnectedComponent(state, {
      getAtlaskitAnalyticsEventHandlers: () => [aHandler],
    });

    component.find(LocalBrowserButton).simulate('click');
    expect(aHandler).toBeCalled();
  });

  describe('pagination', () => {
    const simulateScrollEndReached = (component: ReactWrapper<any, any>) =>
      (component.instance() as any)['onThresholdReachedListener']();

    it('should load next collection page when threshold is reached', () => {
      const { component, context } = createConnectedComponent(state);

      simulateScrollEndReached(component);

      expect(context.collection.loadNextPage).toHaveBeenCalledTimes(1);
      expect(context.collection.loadNextPage).toBeCalledWith('recents');
    });

    it('should render loading next page state if next page is being loaded', async () => {
      const nextItems = new Promise(resolve => setImmediate(resolve));
      const loadNextPage = jest.fn().mockReturnValue(nextItems);
      const context = fakeContext({
        collection: { loadNextPage },
      });
      const { component, root } = createConnectedComponent(
        state,
        undefined,
        context,
      );

      expect(root.find(LoadingNextPageWrapper).find(Spinner)).toHaveLength(0);
      simulateScrollEndReached(component);
      root.update();
      expect(root.find(LoadingNextPageWrapper).find(Spinner)).toHaveLength(1);
      await nextItems;
      root.update();
      expect(root.find(LoadingNextPageWrapper).find(Spinner)).toHaveLength(0);
    });

    it('should not load next collection page if its already being loaded', () => {
      const { component, context } = createConnectedComponent(state);

      simulateScrollEndReached(component);
      simulateScrollEndReached(component);

      expect(context.collection.loadNextPage).toHaveBeenCalledTimes(1);
    });
  });
});
