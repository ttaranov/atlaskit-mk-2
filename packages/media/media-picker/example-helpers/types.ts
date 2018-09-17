import { ImageMetaData } from '@atlaskit/media-ui';

export type AuthEnvironment = 'asap' | 'client';

export interface PreviewData {
  info?: ImageMetaData;
  readonly fileId: string;
  readonly upfrontId?: Promise<string>;
}
