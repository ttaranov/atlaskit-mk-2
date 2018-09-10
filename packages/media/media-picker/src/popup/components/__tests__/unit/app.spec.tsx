import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Store } from 'react-redux';

import { State } from '../../../domain';
import ConnectedApp, { App, AppDispatchProps } from '../../app';
import UploadView from '../../views/upload/upload';
import Browser from '../../views/browser/browser';
import { getComponentClassWithStore, mockStore } from '../../../mocks';
import { fileUploadsStart } from '../../../actions/fileUploadsStart';
import { AuthProvider, ContextFactory } from '@atlaskit/media-core';
import { UploadParams } from '../../../../domain/config';

const tenantUploadParams: UploadParams = {};
import LayerManager from '@atlaskit/layer-manager';
import { LocalBrowserButton } from '../../views/upload/uploadButton';
import { createStore, applyMiddleware, Middleware } from 'redux';
import analyticsProcessing from '../../../middleware/analyticsProcessing';

const baseUrl = 'some-api-url';
const clientId = 'some-client-id';
const token = 'some-token';
const userAuthProvider: AuthProvider = () =>
  Promise.resolve({
    clientId,
    token,
    baseUrl,
  });

describe('App', () => {
  const setup = () => {
    const context = ContextFactory.create({
      authProvider: userAuthProvider,
      userAuthProvider,
    });
    const userContext = ContextFactory.create({
      authProvider: userAuthProvider,
    });
    return {
      handlers: {
        onStartApp: jest.fn(),
        onClose: jest.fn(),
        onUploadsStart: jest.fn(),
        onUploadPreviewUpdate: jest.fn(),
        onUploadStatusUpdate: jest.fn(),
        onUploadProcessing: jest.fn(),
        onUploadEnd: jest.fn(),
        onUploadError: jest.fn(),
        onDropzoneDragIn: jest.fn(),
        onDropzoneDragOut: jest.fn(),
        onDropzoneDropIn: jest.fn(),
      } as AppDispatchProps,
      context,
      userContext,
      store: mockStore(),
      userAuthProvider,
    };
  };

  it('should render UploadView given selectedServiceName is "upload"', () => {
    const { handlers, store, context, userContext } = setup();
    const app = shallow(
      <App
        store={store}
        selectedServiceName="upload"
        isVisible={true}
        tenantContext={context}
        userContext={userContext}
        tenantUploadParams={tenantUploadParams}
        {...handlers}
      />,
    );

    expect(app.find(UploadView).length).toEqual(1);
  });

  it('should render Browser given selectedServiceName is "google"', () => {
    const { handlers, store, context, userContext } = setup();
    const app = shallow(
      <App
        store={store}
        selectedServiceName="google"
        tenantContext={context}
        userContext={userContext}
        isVisible={true}
        tenantUploadParams={tenantUploadParams}
        {...handlers}
      />,
    );

    expect(app.find(Browser).length).toEqual(1);
  });

  it('should call onStartApp', () => {
    const { handlers, store, context, userContext } = setup();
    shallow(
      <App
        store={store}
        selectedServiceName="upload"
        tenantContext={context}
        userContext={userContext}
        isVisible={true}
        tenantUploadParams={tenantUploadParams}
        {...handlers}
      />,
    );

    expect(handlers.onStartApp).toHaveBeenCalledTimes(1);
  });

  it('should activate dropzone when visible', () => {
    const { handlers, store, context, userContext } = setup();
    const element = (
      <App
        store={store}
        selectedServiceName="google"
        tenantContext={context}
        userContext={userContext}
        isVisible={false}
        tenantUploadParams={tenantUploadParams}
        {...handlers}
      />
    );
    const wrapper: any = shallow(element);
    const spy = jest.spyOn(wrapper.instance()['mpDropzone'], 'activate');

    wrapper.setProps({ isVisible: true });

    expect(spy).toBeCalled();
  });

  it('should deactivate dropzone when not visible', () => {
    const { handlers, store, context, userContext } = setup();
    const element = (
      <App
        store={store}
        selectedServiceName="google"
        tenantContext={context}
        userContext={userContext}
        isVisible={true}
        tenantUploadParams={tenantUploadParams}
        {...handlers}
      />
    );
    const wrapper: any = shallow(element);
    const spy = jest.spyOn(wrapper.instance()['mpDropzone'], 'deactivate');

    wrapper.setProps({ isVisible: false });

    expect(spy).toBeCalled();
  });

  it('should deactivate dropzone when unmounted', () => {
    const { handlers, store, context, userContext } = setup();
    const element = (
      <App
        store={store}
        selectedServiceName="google"
        tenantContext={context}
        userContext={userContext}
        isVisible={true}
        tenantUploadParams={tenantUploadParams}
        {...handlers}
      />
    );
    const wrapper: any = shallow(element);
    const spy = jest.spyOn(wrapper.instance()['mpDropzone'], 'deactivate');

    wrapper.unmount();

    expect(spy).toBeCalled();
  });
});

describe('Connected App', () => {
  const setup = () => {
    const store = mockStore();
    const dispatch = store.dispatch;
    const ConnectedAppWithStore = getComponentClassWithStore(ConnectedApp);
    const component = shallow(
      <ConnectedAppWithStore
        store={store}
        tenantUploadParams={tenantUploadParams}
      />,
    ).find(App);
    return { dispatch, component };
  };

  it('should dispatch FILE_UPLOADS_START when onUploadsStart is called', () => {
    const { component, dispatch } = setup();
    const upfrontId = Promise.resolve('');
    const nowDate = Date.now();
    const payload = {
      files: [
        {
          id: 'some-id',
          name: 'some-name',
          size: 42,
          creationDate: nowDate,
          type: 'image/jpg',
          upfrontId,
        },
      ],
    };
    component.props().onUploadsStart(payload);

    expect(dispatch).toHaveBeenCalledWith(
      fileUploadsStart({
        files: [
          {
            id: 'some-id',
            name: 'some-name',
            size: 42,
            creationDate: nowDate,
            type: 'image/jpg',
            upfrontId,
          },
        ],
      }),
    );
  });

  it('should fire an analytics events when provided with a react context via a store', () => {
    const handler = jest.fn();
    const store: Store<State> = createStore<State>(
      state => state,
      mockStore({
        view: {
          isVisible: true,
          items: [],
          isLoading: false,
          hasError: false,
          path: [],
          service: {
            accountId: 'some-view-service-account-id',
            name: 'upload',
          },
          isUploading: false,
          isCancelling: false,
        },
        config: {
          proxyReactContext: {
            getAtlaskitAnalyticsEventHandlers: () => [handler],
          },
        },
      }).getState(),
      applyMiddleware(analyticsProcessing as Middleware),
    );
    const ConnectedAppWithStore = getComponentClassWithStore(ConnectedApp);
    const component = mount(
      <LayerManager>
        <ConnectedAppWithStore store={store} tenantUploadParams={{}} />
      </LayerManager>,
    );
    component.find(LocalBrowserButton).simulate('click');
    expect(handler).toBeCalledWith(
      expect.objectContaining({
        payload: {
          attributes: {
            componentName: 'mediaPicker',
            componentVersion: expect.any(String),
            packageName: '@atlaskit/media-picker',
          },
          eventType: 'screen',
          name: 'localFileBrowserModal',
        },
      }),
      'media',
    );
  });
});
