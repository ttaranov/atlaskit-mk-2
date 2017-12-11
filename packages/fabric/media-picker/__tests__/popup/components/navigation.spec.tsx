import { shallow } from 'enzyme';
import * as React from 'react';
import Dropdown from '@atlaskit/dropdown-menu';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import { getComponentClassWithStore, mockStore, mockState } from '../mocks';
import {
  Navigation,
  default as ConnectedNavigation,
} from '../../../src/popup/components/navigation/navigation';
import {
  changeAccount,
  changeCloudAccountFolder,
  startAuth,
  requestUnlinkCloudAccount,
} from '../../../src/popup/actions';
import {
  Path,
  ServiceName,
  ServiceAccountWithType,
  ServiceAccountLink,
} from '../../../src/popup/domain';
import {
  FolderViewerNavigation,
  ControlsWrapper,
  Controls,
  ControlButton,
  ControlSeparator,
  BreadCrumbs,
  BreadCrumbLink,
  BreadCrumbLinkLabel,
  BreadCrumbLinkSeparator,
  AccountItemButton,
  AccountDropdownWrapper,
} from '../../../src/popup/components/navigation/styled';

const ConnectedNavigationWithStore = getComponentClassWithStore(
  ConnectedNavigation,
);

const createConnectedComponent = () => {
  const store = mockStore();
  const dispatch = store.dispatch;
  const component = shallow(
    <ConnectedNavigationWithStore store={store} />,
  ).find(Navigation);
  return { component, dispatch };
};

describe('<Navigation />', () => {
  const SERVICE_NAME: ServiceName = 'upload';
  const SERVICE_NAME_GOOGLE: ServiceName = 'google';
  const SERVICE_NAME_DROPBOX: ServiceName = 'dropbox';
  const ACCOUNT_ID: string = 'accountId';
  const ACCOUNT_ID_GOOGLE = 'meatgoogle';
  const ACCOUNT_ID_DROPBOX = 'meatdropbox';
  const PATH: Path = [{ id: 'folderId', name: 'folderName' }];
  const SERVICE: ServiceAccountLink = {
    name: SERVICE_NAME,
    accountId: ACCOUNT_ID,
  };
  const SERVICE_GOOGLE: ServiceAccountLink = {
    name: SERVICE_NAME_GOOGLE,
    accountId: ACCOUNT_ID_GOOGLE,
  };
  const SERVICE_DROPBOX: ServiceAccountLink = {
    name: SERVICE_NAME_DROPBOX,
    accountId: ACCOUNT_ID_DROPBOX,
  };
  const ACCOUNTS: ServiceAccountWithType[] = [
    {
      email: 'me@google.com',
      id: 'meatgoogle',
      name: 'me at google',
      nickname: 'me at googley',
      picture: '',
      status: 'available',
      type: 'google',
    },
    {
      email: 'you@google.com',
      id: 'youatgoogle',
      name: 'you at google',
      nickname: 'you at googley',
      picture: '',
      status: 'available',
      type: 'google',
    },
    {
      email: 'me@dropbox.com',
      id: 'meatdropbox',
      name: 'me at dropbox',
      nickname: 'me at droppy',
      picture: '',
      status: 'available',
      type: 'dropbox',
    },
    {
      email: 'you@dropbox.com',
      id: 'youatdropbox',
      name: 'you at dropbox',
      nickname: 'you at droppy',
      picture: '',
      status: 'available',
      type: 'dropbox',
    },
  ];

  describe('Connected Navigation component', () => {
    test('should dispatch an action when onChangeAccount is called', () => {
      const { component, dispatch } = createConnectedComponent();
      component.props().onChangeAccount(SERVICE_NAME, ACCOUNT_ID);
      expect(dispatch).toBeCalledWith(changeAccount(SERVICE_NAME, ACCOUNT_ID));
    });

    test('should dispatch an action when onChangePath is called', () => {
      const { component, dispatch } = createConnectedComponent();
      component.props().onChangePath(SERVICE_NAME, ACCOUNT_ID, PATH);
      expect(dispatch).toBeCalledWith(
        changeCloudAccountFolder(SERVICE_NAME, ACCOUNT_ID, PATH),
      );
    });

    test('should dispatch an action when onStartAuth is called', () => {
      const { component, dispatch } = createConnectedComponent();
      component.props().onStartAuth(SERVICE_NAME);
      expect(dispatch).toBeCalledWith(startAuth(SERVICE_NAME));
    });

    test('should dispatch an action when onUnlinkAccount is called', () => {
      const { component, dispatch } = createConnectedComponent();
      component.props().onUnlinkAccount(SERVICE_NAME, ACCOUNT_ID);
      expect(dispatch).toBeCalledWith(
        requestUnlinkCloudAccount({ name: SERVICE_NAME, id: ACCOUNT_ID }),
      );
    });

    test('should pass all required state through to component props', () => {
      const { component } = createConnectedComponent();
      const props = component.props();

      expect(props.accounts).toEqual(mockState.accounts);
      expect(props.path).toEqual(mockState.view.path);
      expect(props.service).toEqual(mockState.view.service);
    });
  });

  describe('#render()', () => {
    test('should render correct components', () => {
      const element = shallow(
        <Navigation
          accounts={ACCOUNTS}
          path={PATH}
          service={SERVICE}
          onChangeAccount={jest.fn()}
          onChangePath={jest.fn()}
          onStartAuth={jest.fn()}
          onUnlinkAccount={jest.fn()}
        />,
      );

      expect(element.find(FolderViewerNavigation)).toHaveLength(1);
      expect(element.find(ControlsWrapper)).toHaveLength(1);
      expect(element.find(Controls)).toHaveLength(1);
      expect(element.find(ControlButton)).toHaveLength(1);
      expect(element.find(ControlSeparator)).toHaveLength(1);
      expect(element.find(RefreshIcon)).toHaveLength(1);
      expect(element.find(AccountDropdownWrapper)).toHaveLength(1);
      expect(element.find(Dropdown)).toHaveLength(1);
      expect(element.find(AccountItemButton)).toHaveLength(1);
      expect(element.find(SettingsIcon)).toHaveLength(1);
      expect(element.find(BreadCrumbs)).toHaveLength(1);
      expect(element.find(BreadCrumbLink)).toHaveLength(2);
      expect(element.find(BreadCrumbLinkLabel)).toHaveLength(2);
      expect(element.find(BreadCrumbLinkSeparator)).toHaveLength(2);
    });

    test('responds to click on Refresh', () => {
      const onChangePath = jest.fn();

      const element = shallow(
        <Navigation
          accounts={ACCOUNTS}
          path={PATH}
          service={SERVICE}
          onChangeAccount={jest.fn()}
          onChangePath={onChangePath}
          onStartAuth={jest.fn()}
          onUnlinkAccount={jest.fn()}
        />,
      );

      element.find(ControlButton).simulate('click');
      expect(onChangePath).toBeCalledWith(SERVICE_NAME, ACCOUNT_ID, PATH);
    });

    test('responds to openChange on Accounts DropDown', () => {
      const element = shallow(
        <Navigation
          accounts={ACCOUNTS}
          path={PATH}
          service={SERVICE}
          onChangeAccount={jest.fn()}
          onChangePath={jest.fn()}
          onStartAuth={jest.fn()}
          onUnlinkAccount={jest.fn()}
        />,
      );

      element.find(Dropdown).simulate('openChange', { isOpen: true });

      expect(element.find(AccountItemButton)).toHaveLength(1);
      expect(element.find(AccountItemButton).prop('isSelected')).toBe(true);
      expect(element.find(SettingsIcon)).toHaveLength(1);
    });
  });

  describe('#getAccountsDropdownItems()', () => {
    test('retrieves available Google Accounts', () => {
      const onChangeAccount = jest.fn();
      const onStartAuth = jest.fn();
      const onUnlinkAccount = jest.fn();

      const component = new Navigation({
        accounts: ACCOUNTS,
        path: PATH,
        service: SERVICE_GOOGLE,
        onChangeAccount: onChangeAccount,
        onChangePath: jest.fn(),
        onStartAuth: onStartAuth,
        onUnlinkAccount: onUnlinkAccount,
      });

      const items = component.getAccountsDropdownItems();

      expect(items).toEqual([
        {
          heading: 'Accounts',
          items: [
            expect.objectContaining({
              content: <b>me@google.com</b>,
              type: 'radio',
            }),
            expect.objectContaining({
              content: 'you@google.com',
              type: 'radio',
            }),
          ],
        },
        {
          heading: 'Actions',
          items: [
            expect.objectContaining({ content: 'Add account', type: 'radio' }),
            expect.objectContaining({
              content: 'Unlink Account',
              type: 'radio',
            }),
          ],
        },
      ]);
    });

    test('retrieves available Dropbox Accounts', () => {
      const onChangeAccount = jest.fn();
      const onStartAuth = jest.fn();
      const onUnlinkAccount = jest.fn();

      const component = new Navigation({
        accounts: ACCOUNTS,
        path: PATH,
        service: SERVICE_DROPBOX,
        onChangeAccount: onChangeAccount,
        onChangePath: jest.fn(),
        onStartAuth: onStartAuth,
        onUnlinkAccount: onUnlinkAccount,
      });

      const items = component.getAccountsDropdownItems();

      expect(items).toEqual([
        {
          heading: 'Accounts',
          items: [
            expect.objectContaining({
              content: <b>me@dropbox.com</b>,
              type: 'radio',
            }),
            expect.objectContaining({
              content: 'you@dropbox.com',
              type: 'radio',
            }),
          ],
        },
        {
          heading: 'Actions',
          items: [
            expect.objectContaining({ content: 'Add account', type: 'radio' }),
            expect.objectContaining({
              content: 'Unlink Account',
              type: 'radio',
            }),
          ],
        },
      ]);
    });
  });
});
