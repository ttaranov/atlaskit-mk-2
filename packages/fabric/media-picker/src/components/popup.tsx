import { AuthProvider, UploadParams } from '@atlaskit/media-core';
import { Store } from 'redux';
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import appConfig from '../../config';
import { cancelUpload } from '../popup/actions/cancelUpload';
import { showPopup } from '../popup/actions/showPopup';
import { resetView } from '../popup/actions/resetView';
import { setTenant } from '../popup/actions/setTenant';
import { getFilesInRecentsCollection } from '../popup/actions/getFilesInRecentsCollection';
import { WsProvider } from '../popup/tools/websocket/wsProvider';
import { State } from '../popup/domain';
import App from '../popup/components/app';

import { MediaApiFetcher } from '../popup/tools/fetcher/fetcher';
import { ParentChannel } from '../popup/interactors/parentChannel';
import { CloudService } from '../popup/services/cloud-service';

import { createStore } from '../../store';
import { UploadComponent } from './component';

import { handleError } from '../../util/handleError';
import getStaticAssetUrl from '../../util/getStaticAssetUrl';

import {
  MPPopupLoaded,
  MPPopupHidden,
  MPPopupShown,
} from '../outer/analytics/events';
import { MediaFile } from '../domain/file';
import { defaultUploadParams } from '../domain/uploadParams';
import { MediaPickerContext } from '../domain/context';
import { ModuleConfig } from '../domain/config';
import {
  SelectedUploadFile,
  UploadEventPayloadMap,
} from '../domain/uploadEvent';

export interface PopupConfig {
  userAuthProvider: AuthProvider;
  container?: HTMLElement;
}

export const USER_RECENTS_COLLECTION = 'recents';

export interface PopupConstructor {
  new (
    context: MediaPickerContext,
    config: ModuleConfig,
    popupConfig: PopupConfig,
  ): Popup;
}

export type PopupUploadEventPayloadMap = UploadEventPayloadMap & {
  readonly ready: undefined;
  readonly closed: undefined;
};

export class Popup extends UploadComponent<PopupUploadEventPayloadMap> {
  private readonly container: HTMLElement;
  private readonly store: Store<State>;
  private uploadParams: UploadParams;

  constructor(
    context: MediaPickerContext,
    readonly config: ModuleConfig,
    { userAuthProvider, container = document.body }: PopupConfig,
  ) {
    super(context);

    const { apiUrl } = config;
    const redirectUrl = getStaticAssetUrl(appConfig, 'redirectUrl');
    const fetcher = new MediaApiFetcher();
    const parentChannel = this.createParentChannel();
    const authService = {
      getUserAuth: userAuthProvider,
      getTenantAuth: config.authProvider,
    };
    const cloudService = new CloudService(() => authService.getUserAuth());
    const wsProvider = new WsProvider();

    this.context.trackEvent(new MPPopupLoaded());
    this.store = createStore(
      apiUrl,
      redirectUrl,
      userAuthProvider,
      fetcher,
      parentChannel,
      authService,
      cloudService,
      wsProvider,
    );

    this.uploadParams = {
      ...defaultUploadParams,
      ...config.uploadParams,
    };

    const popup = this.renderPopup();

    this.container = popup;
    container.appendChild(popup);
  }

  public show(): Promise<void> {
    return this.config
      .authProvider({
        collectionName: this.uploadParams.collection,
      })
      .then(auth => {
        this.store.dispatch(
          setTenant({
            auth,
            uploadParams: this.uploadParams,
          }),
        );
        this.store.dispatch(resetView());
        this.store.dispatch(getFilesInRecentsCollection());

        this.store.dispatch(showPopup());
        this.context.trackEvent(new MPPopupShown());
      });
  }

  public cancel(uniqueIdentifier: string): void {
    this.store.dispatch(cancelUpload({ tenantUploadId: uniqueIdentifier }));
  }

  public teardown(): void {
    unmountComponentAtNode(this.container);
  }

  public hide(): void {
    this.emit('closed', undefined);
    this.context.trackEvent(new MPPopupHidden());
  }

  public setUploadParams(uploadParams: UploadParams): void {
    this.uploadParams = {
      ...defaultUploadParams,
      ...uploadParams,
    };
  }

  private renderPopup(): HTMLElement {
    const container = document.createElement('div');

    render(<App store={this.store} />, container);

    return container;
  }

  private createParentChannel = (): ParentChannel => ({
    ready: () => this.emit('ready', undefined),
    hidePopup: () => this.hide(),
    sendUploadEvent: (event, uploadId, publicId) => {
      switch (event.name) {
        case 'upload-finalize-ready': {
          const file = copyUserFileUploadForTenant(
            event.data.file,
            uploadId,
            publicId,
          );
          this.emitUploadFinalizeReady(file, event.data.finalize);
          break;
        }
        case 'upload-status-update': {
          const file = copyUserFileUploadForTenant(
            event.data.file,
            uploadId,
            publicId,
          );
          this.emitUploadProgress(file, event.data.progress);
          break;
        }
        case 'upload-preview-update': {
          const { preview } = event.data;
          const file = copyUserFileUploadForTenant(
            event.data.file,
            uploadId,
            publicId,
          );
          this.emitUploadPreviewUpdate(file, preview);
          break;
        }
        case 'upload-processing': {
          const file = copyUserFileUploadForTenant(
            event.data.file,
            uploadId,
            publicId,
          );
          this.emitUploadProcessing(file);
          break;
        }
        case 'upload-end': {
          const file = copyUserFileUploadForTenant(
            event.data.file,
            uploadId,
            publicId,
          );
          this.emitUploadEnd(file, event.data.public);
          break;
        }
        case 'upload-error': {
          const file = copyUserFileUploadForTenant(
            event.data.file,
            uploadId,
            publicId,
          );
          const { error } = event.data;
          this.emitUploadError(file, error);
          handleError(error.name, error.description);
          break;
        }
      }
    },
    sendUploadsStartEvent: (selectedUploadFiles: SelectedUploadFile[]) => {
      this.emitUploadsStart(
        selectedUploadFiles.map(({ file, uploadId }) =>
          copyUserFileUploadForTenant(file, uploadId),
        ),
      );
    },
  });
}

function copyUserFileUploadForTenant(
  file: MediaFile,
  uploadId: string,
  publicId?: string,
): MediaFile {
  return {
    ...file,
    id: uploadId,
    publicId,
  };
}
