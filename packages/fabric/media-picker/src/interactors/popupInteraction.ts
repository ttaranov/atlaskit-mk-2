import { PostisChannel } from 'postis';
import { EventEmitter2 } from 'eventemitter2';
import { UploadParams } from '@atlaskit/media-core';

// import { Popup } from '../components/popup';
import { Tenant } from '../domain/tenant';
import { UploadEvent } from '../domain/uploadEvent';

export interface PopupUrls {
  apiUrl: string;
  redirectUrl: string;
}

export type InteractionLayerEventPayloadTypes = {
  readonly uploadStart: any;
  readonly uploadProcessing: { uploadId: string; publicFileId: string };
  readonly uploadEnd: { uploadId: string; file: any };
  readonly uploadError: {
    readonly uploadId: string;
    readonly errorName: string;
    readonly errorMessage: string;
  };
  readonly updatePreview: { uploadId: string; preview: string };
  readonly uploadEvent: UploadEvent;
  readonly ready: undefined;
};

export class InteractionLayer {
  private readonly emitter: EventEmitter2;

  constructor(private readonly channel: PostisChannel) {
    this.emitter = new EventEmitter2();
  }

  public initProtocol(): void {
    this.channel.ready(() => {
      // this.channel.listen('hidePopup', () => {
      //   this.popup.hide();
      // });

      // this.channel.listen('showPopup', () => {
      //   this.popup.show();
      // });

      this.channel.listen('ready', () => {
        this.emit('ready', undefined);
      });

      this.channel.listen('uploadEvent', data => {
        this.emit('uploadEvent', data.event);
      });
    });
  }

  public resetView(): void {
    this.channel.send({
      method: 'resetView',
    });
  }

  public cancelUpload(uploadId: string): void {
    this.channel.send({
      method: 'cancelUpload',
      params: {
        uploadId,
      },
    });
  }

  public setTenant({ auth, uploadParams }: Tenant): void {
    this.channel.send({
      method: 'setTenant',
      params: {
        auth,
        uploadParams: this.sanitizeUploadParams(uploadParams),
      },
    });
  }

  public on<E extends keyof InteractionLayerEventPayloadTypes>(
    event: E,
    listener: (value: InteractionLayerEventPayloadTypes[E]) => void,
  ): void {
    this.emitter.on(event, listener);
  }

  private emit<E extends keyof InteractionLayerEventPayloadTypes>(
    event: E,
    value: InteractionLayerEventPayloadTypes[E],
  ): void {
    this.emitter.emit(event, value);
  }

  private sanitizeUploadParams = ({
    collection,
    fetchMetadata,
    autoFinalize,
  }: UploadParams): UploadParams => ({
    collection,
    fetchMetadata,
    autoFinalize,
  });
}
