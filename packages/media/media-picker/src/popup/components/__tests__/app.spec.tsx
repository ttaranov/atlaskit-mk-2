import * as React from 'react';
import { shallow } from 'enzyme';

import ConnectedApp, { App, AppDispatchProps } from '../app';
import UploadView from '../views/upload/upload';
import Browser from '../views/browser/browser';
import { getComponentClassWithStore, mockStore } from '../../mocks';
import { fileUploadsStart } from '../../actions/fileUploadsStart';
import { AuthProvider, ContextFactory } from '@atlaskit/media-core';

describe('App', () => {
  const baseUrl = 'some-api-url';
  const clientId = 'some-client-id';
  const token = 'some-token';
  const userAuthProvider: AuthProvider = () =>
    Promise.resolve({
      clientId,
      token,
      baseUrl,
    });

  const setup = () => {
    const context = ContextFactory.create({
      authProvider: userAuthProvider,
      userAuthProvider,
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
      } as AppDispatchProps,
      context,
      store: mockStore(),
      userAuthProvider,
    };
  };

  it('should render UploadView given selectedServiceName is "upload"', () => {
    const { handlers, store, context } = setup();
    const app = shallow(
      <App
        store={store}
        selectedServiceName="upload"
        isVisible={true}
        context={context}
        {...handlers}
      />,
    );

    expect(app.find(UploadView).length).toEqual(1);
  });

  it('should render Browser given selectedServiceName is "google"', () => {
    const { handlers, store, context } = setup();
    const app = shallow(
      <App
        store={store}
        selectedServiceName="google"
        context={context}
        isVisible={true}
        {...handlers}
      />,
    );

    expect(app.find(Browser).length).toEqual(1);
  });

  it('should call onStartApp', () => {
    const { handlers, store, context } = setup();
    shallow(
      <App
        store={store}
        selectedServiceName="upload"
        context={context}
        isVisible={true}
        {...handlers}
      />,
    );

    expect(handlers.onStartApp).toHaveBeenCalledTimes(1);
  });

  it('should activate dropzone when visible', () => {
    const { handlers, store, context } = setup();
    const element = (
      <App
        store={store}
        selectedServiceName="google"
        context={context}
        isVisible={false}
        {...handlers}
      />
    );
    const wrapper = shallow(element);
    const spy = jest.spyOn(wrapper.instance()['mpDropzone'], 'activate');

    wrapper.setProps({ isVisible: true });

    expect(spy).toBeCalled();
  });

  it('should deactivate dropzone when not visible', () => {
    const { handlers, store, context } = setup();
    const element = (
      <App
        store={store}
        selectedServiceName="google"
        context={context}
        isVisible={true}
        {...handlers}
      />
    );
    const wrapper = shallow(element);
    const spy = jest.spyOn(wrapper.instance()['mpDropzone'], 'deactivate');

    wrapper.setProps({ isVisible: false });

    expect(spy).toBeCalled();
  });

  it('should deactivate dropzone when unmounted', () => {
    const { handlers, store, context } = setup();
    const element = (
      <App
        store={store}
        selectedServiceName="google"
        context={context}
        isVisible={true}
        {...handlers}
      />
    );
    const wrapper = shallow(element);
    const spy = jest.spyOn(wrapper.instance()['mpDropzone'], 'deactivate');

    wrapper.unmount();

    expect(spy).toBeCalled();
  });

  it('should pass new context to the local MediaPicker components', () => {
    const { handlers, store, context, userAuthProvider } = setup();
    const component = shallow(
      <App
        store={store}
        selectedServiceName="upload"
        context={context}
        isVisible={true}
        {...handlers}
      />,
    );
    const instance = component.instance();
    const mpContext = instance['mpContext'];

    expect(mpContext.config.authProvider).toEqual(userAuthProvider);
    expect(instance['mpBrowser'].context).toEqual(mpContext);
    expect(instance['mpDropzone'].context).toEqual(mpContext);
    expect(instance['mpBinary'].context).toEqual(mpContext);
  });
});

describe('Connected App', () => {
  const setup = () => {
    const store = mockStore();
    const dispatch = store.dispatch;
    const ConnectedAppWithStore = getComponentClassWithStore(ConnectedApp);
    const component = shallow(<ConnectedAppWithStore store={store} />).find(
      App,
    );
    return { dispatch, component };
  };

  it('should dispatch FILE_UPLOADS_START when onUploadsStart is called', () => {
    const { component, dispatch } = setup();

    const nowDate = Date.now();
    const payload = {
      files: [
        {
          id: 'some-id',
          name: 'some-name',
          size: 42,
          creationDate: nowDate,
          type: 'image/jpg',
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
          },
        ],
      }),
    );
  });
});
