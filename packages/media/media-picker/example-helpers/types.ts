import { ImagePreview, Preview } from '../src/domain/preview';

export type AuthEnvironment = 'asap' | 'client';

export interface PreviewData {
  preview: ImagePreview | Preview | null;
  readonly fileId: string;
  readonly upfrontId?: Promise<string>;
}
