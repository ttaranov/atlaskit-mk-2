import { AuthProvider } from '@atlaskit/media-core';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import { AuthService } from '../popup/services/auth-service';
import { CloudService } from '../popup/services/cloud-service';
import { Fetcher } from '../popup/tools/fetcher/fetcher';
import { ParentChannel } from '../popup/interactors/parentChannel';
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
import { finalizeUpload } from '../popup/middleware/finalizeUpload';
import { getPreview } from '../popup/middleware/getPreview';
import { handleCloudFetchingEvent } from '../popup/middleware/handleCloudFetchingEvent';
import { hidePopup } from '../popup/middleware/hidePopup';

export default (
  apiUrl: string,
  redirectUrl: string,
  userAuthProvider: AuthProvider,
  fetcher: Fetcher,
  parentChannel: ParentChannel,
  authService: AuthService,
  cloudService: CloudService,
  wsProvider: WsProvider,
): Store<State> =>
  createStore(
    reducers,
    {
      ...defaultState,
      apiUrl,
      redirectUrl,
      userAuthProvider,
    },
    composeWithDevTools(
      applyMiddleware(
        startAppMiddleware(parentChannel),
        getFilesInRecentsCollection(fetcher, userAuthProvider),
        changeService,
        changeAccount,
        changeCloudAccountFolderMiddleware(fetcher, authService),
        fetchNextCloudFilesPageMiddleware(fetcher, authService),
        startCloudAccountOAuthFlow(fetcher, authService, cloudService),
        unlinkCloudAccount(fetcher, authService),
        getConnectedRemoteAccounts(fetcher, authService),
        cancelUpload,
        importFilesMiddleware(authService, parentChannel, wsProvider),
        // TODO: Edit currently does not work. Probably needs webpack conguration.
        editRemoteImageMiddleware(fetcher, authService),
        getPreview(fetcher, authService, parentChannel),
        finalizeUpload(fetcher, authService, parentChannel),
        proxyUploadEvents(parentChannel),
        handleCloudFetchingEvent(parentChannel),
        hidePopup(parentChannel),
      ),
    ),
  );
