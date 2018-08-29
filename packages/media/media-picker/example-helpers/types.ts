export type AuthEnvironment = 'asap' | 'client';

export interface PreviewData {
  readonly fileId: string;
  readonly upfrontId?: Promise<string>;
}
