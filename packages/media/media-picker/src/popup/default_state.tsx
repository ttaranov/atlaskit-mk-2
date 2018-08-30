import { State } from './domain';

const state: State = {
  redirectUrl: '',
  userAuthProvider: () => Promise.reject('User AuthProvider not provided.'),
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
  context: {} as any, // TODO: fix this
  config: {},
  deferredIdUpfronts: {},
};

export default state;
