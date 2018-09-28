import * as React from 'react';
import { Context, ProcessedFileState } from '@atlaskit/media-core';
import { Outcome } from '../../domain';
import { ErrorMessage, createError, MediaViewerError } from '../../error';
import { Spinner } from '../../loading';
import { constructAuthTokenUrl } from '../../utils';
import { Props as RendererProps } from './pdfRenderer';
import { ComponentClass } from 'react';
import { renderDownloadButton } from '../../domain/download';
import { getArtifactUrl } from '@atlaskit/media-store';

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
  src: Outcome<string, MediaViewerError>;
};

const initialState: State = {
  src: Outcome.pending(),
};

export class DocViewer extends React.Component<Props, State> {
  static PDFComponent: ComponentClass<RendererProps>;

  state: State = initialState;

  componentDidMount() {
    this.init(this.props);
  }

  componentWillUpdate(nextProps: Props) {
    if (this.needsReset(this.props, nextProps)) {
      this.init(nextProps);
    }
  }

  private async init(props: Props) {
    if (!DocViewer.PDFComponent) {
      await this.loadDocViewer();
    }
    const { item, context, collectionName } = props;

    const pdfArtifactUrl = getArtifactUrl(item.artifacts, 'document.pdf');
    if (!pdfArtifactUrl) {
      this.setState({
        src: Outcome.failed(
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
        src: Outcome.successful(src),
      });
    } catch (err) {
      this.setState({
        src: Outcome.failed(createError('previewFailed', err, item)),
      });
    }
  }

  private async loadDocViewer() {
    DocViewer.PDFComponent = await componentLoader();
    this.forceUpdate();
  }

  private renderDownloadButton() {
    const { item, context, collectionName } = this.props;
    return renderDownloadButton(item, context, collectionName);
  }

  private needsReset(propsA: Props, propsB: Props) {
    return (
      propsA.item.id !== propsB.item.id || propsA.context !== propsB.context
    );
  }

  render() {
    const { onClose } = this.props;
    const { PDFComponent } = DocViewer;

    if (!PDFComponent) {
      return <Spinner />;
    }

    return this.state.src.match({
      pending: () => <Spinner />,
      successful: src => {
        return <PDFComponent src={src} onClose={onClose} />;
      },
      failed: err => (
        <ErrorMessage error={err}>
          <p>Try downloading the file to view it.</p>
          {this.renderDownloadButton()}
        </ErrorMessage>
      ),
    });
  }
}
