import { Context, ContextFactory } from '@atlaskit/media-core';
import { Store } from 'redux';
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import App, { AppProxyReactContext } from '../popup/components/app';
import { cancelUpload } from '../popup/actions/cancelUpload';
import { showPopup } from '../popup/actions/showPopup';
import { resetView } from '../popup/actions/resetView';
import { setTenant } from '../popup/actions/setTenant';
import { getFilesInRecents } from '../popup/actions/getFilesInRecents';
import { getConnectedRemoteAccounts } from '../popup/actions/getConnectedRemoteAccounts';
import { State } from '../popup/domain';
import { hidePopup } from '../popup/actions/hidePopup';
import { createStore } from '../store';
import { UploadComponent, UploadEventEmitter } from './component';

import { defaultUploadParams } from '../domain/uploadParams';
import { UploadParams } from '../domain/config';
import { UploadEventPayloadMap } from '../domain/uploadEvent';

export interface PopupConfig {
  readonly container?: HTMLElement;
  readonly uploadParams: UploadParams; // Tenant upload params
  readonly proxyReactContext?: AppProxyReactContext;
  readonly singleSelect?: boolean;
}

export interface PopupConstructor {
  new (context: Context, config: PopupConfig): Popup;
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
  private tenantUploadParams: UploadParams;
  private proxyReactContext?: AppProxyReactContext;

  constructor(
    readonly tenantContext: Context,
    {
      container = document.body,
      uploadParams, // tenant
      proxyReactContext,
      singleSelect,
    }: PopupConfig,
  ) {
    super();
    this.proxyReactContext = proxyReactContext;

    const { userAuthProvider, cacheSize } = tenantContext.config;
    if (!userAuthProvider) {
      throw new Error(
        'When using Popup media picker userAuthProvider must be provided in the context',
      );
    }

    const userContext = ContextFactory.create({
      cacheSize,
      authProvider: userAuthProvider,
    });
    this.store = createStore(this, tenantContext, userContext, {
      proxyReactContext,
      singleSelect,
    });

    this.tenantUploadParams = {
      ...defaultUploadParams,
      ...uploadParams,
    };

    const popup = this.renderPopup();

    this.container = popup;
    container.appendChild(popup);
  }

  public async show(): Promise<void> {
    const { dispatch } = this.store;
    // TODO [MS-677]: Improve opening time by removing call to authProvider + setTenant
    const auth = await this.tenantContext.config.authProvider({
      collectionName: this.tenantUploadParams.collection,
    });

    dispatch(
      setTenant({
        auth,
        uploadParams: this.tenantUploadParams,
      }),
    );

    dispatch(resetView());
    dispatch(getFilesInRecents());
    // TODO [MSW-466]: Fetch remote accounts only when needed
    dispatch(getConnectedRemoteAccounts());
    dispatch(showPopup());
  }

  public async cancel(
    uniqueIdentifier?: string | Promise<string>,
  ): Promise<void> {
    if (!uniqueIdentifier) {
      return;
    }

    this.store.dispatch(
      cancelUpload({ tenantUploadId: await uniqueIdentifier }),
    );
  }

  public teardown(): void {
    unmountComponentAtNode(this.container);
  }

  public hide(): void {
    this.store.dispatch(hidePopup());
  }

  public setUploadParams(uploadParams: UploadParams): void {
    this.tenantUploadParams = {
      ...defaultUploadParams,
      ...uploadParams,
    };
  }

  public emitClosed(): void {
    this.emit('closed', undefined);
  }

  private renderPopup(): HTMLElement {
    const container = document.createElement('div');
    render(
      <App
        store={this.store}
        proxyReactContext={this.proxyReactContext}
        tenantUploadParams={this.tenantUploadParams}
      />,
      container,
    );
    return container;
  }
}
