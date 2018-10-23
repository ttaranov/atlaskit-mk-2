import * as React from 'react';
import { Context, ProcessedFileState } from '@atlaskit/media-core';
import { Outcome } from '../../domain';
import { createError, MediaViewerError } from '../../error';
import { Spinner } from '../../loading';
import { constructAuthTokenUrl } from '../../utils';
import { Props as RendererProps } from './pdfRenderer';
import { ComponentClass } from 'react';
import { getArtifactUrl } from '@atlaskit/media-store';
import { BaseViewer } from '../base-viewer';

const moduleLoader = () =>
  import(/* webpackChunkName:"@atlaskit-internal_media-viewer-pdf-viewer" */ './pdfRenderer');

const componentLoader: () => Promise<ComponentClass<RendererProps>> = () =>
  moduleLoader().then(module => module.PDFRenderer);

export type Props = {
  context: Context;
  item: ProcessedFileState;
  collectionName?: string;
  onClose?: () => void;
};

export type State = {
  content: Outcome<string, MediaViewerError>;
};

export class DocViewer extends BaseViewer<string, Props> {
  static PDFComponent: ComponentClass<RendererProps>;

  protected get initialState() {
    return {
      content: Outcome.pending<string, MediaViewerError>(),
    };
  }

  protected async init() {
    if (!DocViewer.PDFComponent) {
      await this.loadDocViewer();
    }
    const { item, context, collectionName } = this.props;

    const pdfArtifactUrl = getArtifactUrl(item.artifacts, 'document.pdf');
    if (!pdfArtifactUrl) {
      this.setState({
        content: Outcome.failed(
          createError('noPDFArtifactsFound', undefined, item),
        ),
      });
      return;
    }
    try {
      const src = await constructAuthTokenUrl(
        pdfArtifactUrl,
        context,
        collectionName,
      );
      this.setState({
        content: Outcome.successful(src),
      });
    } catch (err) {
      this.setState({
        content: Outcome.failed(createError('previewFailed', err, item)),
      });
    }
  }

  private async loadDocViewer() {
    DocViewer.PDFComponent = await componentLoader();
    this.forceUpdate();
  }

  protected release() {}

  protected renderSuccessful(content: string) {
    const { onClose } = this.props;
    const { PDFComponent } = DocViewer;

    if (!PDFComponent) {
      return <Spinner />;
    }
    return <PDFComponent src={content} onClose={onClose} />;
  }
}
