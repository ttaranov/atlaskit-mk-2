import { AuthProvider } from '@atlaskit/media-core';
import { applyMiddleware, createStore, Store, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import { CloudService } from '../../popup/src/services/cloud-service';
import { Fetcher } from '../../popup/src/tools/fetcher/fetcher';
import { WsProvider } from '../../popup/src/tools/websocket/wsProvider';
import reducers from '../../popup/src/reducers/reducers';
import { State } from '../../popup/src/domain';
import defaultState from '../../popup/src/default_state';

import changeAccount from '../../popup/src/middleware/changeAccount';
import { changeService } from '../../popup/src/middleware/changeService';
import { fetchNextCloudFilesPageMiddleware } from '../../popup/src/middleware/fetchNextCloudFilesPage';
import { changeCloudAccountFolderMiddleware } from '../../popup/src/middleware/changeCloudAccountFolder';
import startAppMiddleware from '../../popup/src/middleware/startApp';
import { getConnectedRemoteAccounts } from '../../popup/src/middleware/getConnectedRemoteAccounts';
import { getFilesInRecentsCollection } from '../../popup/src/middleware/getFilesInRecentsCollection';
import { importFilesMiddleware } from '../../popup/src/middleware/importFiles';
import { startCloudAccountOAuthFlow } from '../../popup/src/middleware/startAuth';
import unlinkCloudAccount from '../../popup/src/middleware/unlinkCloudAccount';
import { proxyUploadEvents } from '../../popup/src/middleware/proxyUploadEvents';
import cancelUpload from '../../popup/src/middleware/cancelUpload';
import { editRemoteImageMiddleware } from '../../popup/src/middleware/editRemoteImage';
import finalizeUploadMiddleware from '../../popup/src/middleware/finalizeUpload';
import getPreviewMiddleware from '../../popup/src/middleware/getPreview';
import { handleCloudFetchingEvent } from '../../popup/src/middleware/handleCloudFetchingEvent';
import hidePopupMiddleware from '../../popup/src/middleware/hidePopup';
import sendUploadEventMiddleware from '../../popup/src/middleware/sendUploadEvent';
import { PopupUploadEventEmitter } from '../components/popup';
import { AuthService } from '../domain/auth';

export default (
  eventEmitter: PopupUploadEventEmitter,
  apiUrl: string,
  redirectUrl: string,
  userAuthProvider: AuthProvider,
  fetcher: Fetcher,
  authService: AuthService,
  cloudService: CloudService,
  wsProvider: WsProvider,
): Store<State> => {
  return createStore(
    reducers,
    {
      ...defaultState,
      apiUrl,
      redirectUrl,
      userAuthProvider,
    },
    composeWithDevTools(
      applyMiddleware(
        startAppMiddleware(eventEmitter) as Middleware,
        getFilesInRecentsCollection(fetcher, userAuthProvider) as Middleware,
        changeService,
        changeAccount as Middleware,
        changeCloudAccountFolderMiddleware(fetcher, authService) as Middleware,
        fetchNextCloudFilesPageMiddleware(fetcher, authService) as Middleware,
        startCloudAccountOAuthFlow(
          fetcher,
          authService,
          cloudService,
        ) as Middleware,
        unlinkCloudAccount(fetcher, authService) as Middleware,
        getConnectedRemoteAccounts(fetcher, authService) as Middleware,
        cancelUpload as Middleware,
        importFilesMiddleware(eventEmitter, authService, wsProvider),
        editRemoteImageMiddleware(fetcher, authService) as Middleware,
        getPreviewMiddleware(fetcher, authService),
        finalizeUploadMiddleware(fetcher, authService),
        proxyUploadEvents as Middleware,
        handleCloudFetchingEvent as Middleware,
        hidePopupMiddleware(eventEmitter) as Middleware,
        sendUploadEventMiddleware(eventEmitter),
      ),
    ),
  );
};
