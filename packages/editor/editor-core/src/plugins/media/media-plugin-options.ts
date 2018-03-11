import { ProviderFactory } from '@atlaskit/editor-common';
import { ErrorReporter } from '../../utils';
import { MediaState } from './types';

export type MediaPluginOptions = {
  providerFactory: ProviderFactory;
  errorReporter?: ErrorReporter;
  uploadErrorHandler?: (state: MediaState) => void;
  waitForMediaUpload?: boolean;
  customDropzoneContainer?: HTMLElement;
};
