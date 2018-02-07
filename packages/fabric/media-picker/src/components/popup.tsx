import { AuthProvider } from '@atlaskit/media-core';
import { Store } from 'redux';
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import App from '../popup/components/app';
import { cancelUpload } from '../popup/actions/cancelUpload';
import { showPopup } from '../popup/actions/showPopup';
import { resetView } from '../popup/actions/resetView';
import { setTenant } from '../popup/actions/setTenant';
import { getFilesInRecentsCollection } from '../popup/actions/getFilesInRecentsCollection';
import { WsProvider } from '../popup/tools/websocket/wsProvider';
import { State } from '../popup/domain';

import { MediaApiFetcher } from '../popup/tools/fetcher/fetcher';
import { CloudService } from '../popup/services/cloud-service';
import { hidePopup } from '../popup/actions/hidePopup';

import appConfig from '../config';
import { createStore } from '../store';
import { UploadComponent, UploadEventEmitter } from './component';

import {
  MPPopupLoaded,
  MPPopupShown,
  MPPopupHidden,
} from '../outer/analytics/events';
import { defaultUploadParams } from '../domain/uploadParams';
import { MediaPickerContext } from '../domain/context';
import { ModuleConfig, UploadParams } from '../domain/config';
import { UploadEventPayloadMap } from '../domain/uploadEvent';

export interface PopupConfig {
  readonly userAuthProvider: AuthProvider;
  readonly container?: HTMLElement;
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
  readonly closed: undefined;
};

export interface PopupUploadEventEmitter extends UploadEventEmitter {
  emitClosed(): void;
}

export class Popup extends UploadComponent<PopupUploadEventPayloadMap>
  implements PopupUploadEventEmitter {
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
    const redirectUrl = appConfig.html.redirectUrl;
    const fetcher = new MediaApiFetcher();
    const authService = {
      getUserAuth: userAuthProvider,
      getTenantAuth: config.authProvider,
    };
    const cloudService = new CloudService(() => authService.getUserAuth());
    const wsProvider = new WsProvider();

    this.context.trackEvent(new MPPopupLoaded());
    this.store = createStore(
      this,
      apiUrl,
      redirectUrl,
      userAuthProvider,
      fetcher,
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
    this.store.dispatch(hidePopup());
  }

  public setUploadParams(uploadParams: UploadParams): void {
    this.uploadParams = {
      ...defaultUploadParams,
      ...uploadParams,
    };
  }

  public emitClosed(): void {
    this.emit('closed', undefined);
    this.context.trackEvent(new MPPopupHidden());
  }

  private renderPopup(): HTMLElement {
    const container = document.createElement('div');
    render(<App store={this.store} />, container);
    return container;
  }
}
