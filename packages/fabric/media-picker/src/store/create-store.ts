import { AuthProvider } from '@atlaskit/media-core';
import { applyMiddleware, createStore, Store, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import { CloudService } from '../popup/services/cloud-service';
import { Fetcher } from '../popup/tools/fetcher/fetcher';
import { WsProvider } from '../popup/tools/websocket/wsProvider';
import reducers from '../popup/reducers/reducers';
import { State } from '../popup/domain';
import defaultState from '../popup/default_state';

import changeAccount from '../popup/middleware/changeAccount';
import { changeService } from '../popup/middleware/changeService';
import { fetchNextCloudFilesPageMiddleware } from '../popup/middleware/fetchNextCloudFilesPage';
import { changeCloudAccountFolderMiddleware } from '../popup/middleware/changeCloudAccountFolder';
import startAppMiddleware from '../popup/middleware/startApp';
import { getConnectedRemoteAccounts } from '../popup/middleware/getConnectedRemoteAccounts';
import { getFilesInRecentsCollection } from '../popup/middleware/getFilesInRecentsCollection';
import { importFilesMiddleware } from '../popup/middleware/importFiles';
import { startCloudAccountOAuthFlow } from '../popup/middleware/startAuth';
import unlinkCloudAccount from '../popup/middleware/unlinkCloudAccount';
import { proxyUploadEvents } from '../popup/middleware/proxyUploadEvents';
import cancelUpload from '../popup/middleware/cancelUpload';
import { editRemoteImageMiddleware } from '../popup/middleware/editRemoteImage';
import finalizeUploadMiddleware from '../popup/middleware/finalizeUpload';
import getPreviewMiddleware from '../popup/middleware/getPreview';
import { handleCloudFetchingEvent } from '../popup/middleware/handleCloudFetchingEvent';
import searchGiphy from '../popup/middleware/searchGiphy';
import hidePopupMiddleware from '../popup/middleware/hidePopup';
import sendUploadEventMiddleware from '../popup/middleware/sendUploadEvent';
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
        changeService as Middleware,
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
        searchGiphy(fetcher) as Middleware,
        hidePopupMiddleware(eventEmitter) as Middleware,
        sendUploadEventMiddleware(eventEmitter),
      ),
    ),
  );
};
