import * as React from 'react';
import { asyncComponent } from 'react-async-component';
import { Context } from '@atlaskit/media-core';
import { Identifier, ItemSource, MediaViewerFeatureFlags } from './domain';
import { Content } from './content';
import { Blanket } from './styled';
import { Shortcut } from './shortcut';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { Spinner } from './loading';
import { createError, ErrorMessage } from './error';

export type Props = {
  onClose?: () => void;
  selectedItem?: Identifier;
  featureFlags?: MediaViewerFeatureFlags;
  context: Context;
  itemSource: ItemSource;
};

export const contentResolve = () =>
  import(/* webpackChunkName:"@atlaskit-internal_media-viewer-preview" */ './content-body');

export const ContentLoader = asyncComponent<Props>({
  resolve: contentResolve,
  LoadingComponent: () => <Spinner />,
  ErrorComponent: () => <ErrorMessage error={createError('previewFailed')} />,
});

export class MediaViewer extends React.Component<Props> {
  render() {
    const { onClose } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Blanket>
          {onClose && <Shortcut keyCode={27} handler={onClose} />}
          <Content onClose={onClose}>
            <ContentLoader {...this.props} />
          </Content>
        </Blanket>
      </ThemeProvider>
    );
  }
}
