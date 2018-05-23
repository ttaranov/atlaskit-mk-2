import { Preview } from '../src/domain/preview';

export type AuthEnvironment = 'asap' | 'client';

export interface PreviewData {
  readonly fileId: string;
  readonly preview: Preview;
  readonly isProcessed: boolean;
  readonly uploadingProgress: number;
}
