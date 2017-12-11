import { State } from './domain';

const state: State = {
  apiUrl: '',
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
    },
    uploadParams: {},
  },
  view: {
    isVisible: false,
    service: {
      name: 'upload',
      accountId: '',
    },
    loading: false,
    path: [],
    items: [],
    hasPopupBeenVisible: false,
    isUploading: false,
    isCancelling: false,
  },
  accounts: [],
  selectedItems: [],
  isUploading: false,
  isCancelling: false,
  lastUploadIndex: 0,
  onCancelUpload: () => {
    throw new Error('onCancelUpload has not been set yet.');
  },
};

export default state;
