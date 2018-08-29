import { State } from './domain';

export type DefaultStateKeys = Exclude<
  keyof State,
  'context' | 'userContext' | 'redirectUrl' | 'config'
>;
export type DefaultState = Pick<State, DefaultStateKeys>;
const defaultState: DefaultState = {
  uploads: {},
  remoteUploads: {},
  recents: {
    nextKey: '',
    items: [],
  },
  tenant: {
    auth: {
      clientId: '',
      token: '',
      baseUrl: '',
    },
    uploadParams: {},
  },
  view: {
    isVisible: false,
    service: {
      name: 'upload',
      accountId: '',
    },
    hasError: false,
    isLoading: true,
    path: [],
    items: [],
    isUploading: false,
    isCancelling: false,
  },
  accounts: [],
  selectedItems: [],
  isUploading: false,
  isCancelling: false,
  lastUploadIndex: 0,
  giphy: {
    imageCardModels: [],
    totalResultCount: undefined,
  },
  onCancelUpload: () => {
    throw new Error('onCancelUpload has not been set yet.');
  },
};

export default defaultState;
