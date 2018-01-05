import { MediaState } from '@atlaskit/media-core';
import { ProviderFactory } from '@atlaskit/editor-common';
import { ErrorReporter } from '../../utils';

export type MediaPluginOptions = {
  providerFactory: ProviderFactory;
  errorReporter?: ErrorReporter;
  uploadErrorHandler?: (state: MediaState) => void;
  waitForMediaUpload?: boolean;
};
