import { deselectItem } from '../../../actions/deselectItem';
import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { BinaryUploader } from '../../../../components/binary';
import { State, EditorData, EditorError, FileReference } from '../../../domain';
import { ErrorView } from './errorView/errorView';
import { SpinnerView } from './spinnerView/spinnerView';
import { MainContainer } from './styles';
import { couldNotLoadEditor } from './phrases';
import { editorClose } from '../../../actions/editorClose';
import { editorShowError } from '../../../actions/editorShowError';
import { editorShowImage } from '../../../actions/editorShowImage';

let editorViewModule: any;

export interface MainEditorViewStateProps {
  readonly editorData?: EditorData;
}

export interface MainEditorViewOwnProps {
  readonly binaryUploader: BinaryUploader;
}

export interface MainEditorViewDispatchProps {
  readonly onCloseEditor: () => void;
  readonly onShowEditorError: (error: EditorError) => void;
  readonly onShowEditorImage: (
    imageUrl: string,
    originalFile?: FileReference,
  ) => void;
  readonly onDeselectFile: (fileId: string) => void;
}

export type MainEditorViewProps = MainEditorViewStateProps &
  MainEditorViewOwnProps &
  MainEditorViewDispatchProps;

export interface MainEditorViewState {
  readonly isEditorViewLoaded: boolean;
}

export class MainEditorView extends Component<
  MainEditorViewProps,
  MainEditorViewState
> {
  constructor(props: MainEditorViewProps) {
    super(props);
    this.state = {
      isEditorViewLoaded: !!editorViewModule,
    };
  }

  componentDidMount() {
    this.ensureEditorViewModuleLoaded(this.props);
  }

  componentWillReceiveProps(newProps: MainEditorViewProps) {
    this.ensureEditorViewModuleLoaded(newProps);
  }

  render(): JSX.Element | null {
    const { editorData } = this.props;
    if (editorData) {
      return <MainContainer>{this.renderContent(editorData)}</MainContainer>;
    } else {
      return null;
    }
  }

  private renderContent(editorData: EditorData): JSX.Element {
    const { imageUrl, originalFile, error } = editorData;

    if (error) {
      return this.renderError(error);
    } else if (editorViewModule && imageUrl && originalFile) {
      const { EditorView } = editorViewModule;
      return (
        <EditorView
          imageUrl={imageUrl}
          onSave={this.onEditorSave(originalFile)}
          onCancel={this.onCancel}
          onError={this.onEditorError}
        />
      );
    } else {
      return <SpinnerView onCancel={this.onCancel} />;
    }
  }

  private renderError({ message, retryHandler }: EditorError): JSX.Element {
    return (
      <ErrorView
        message={message}
        onRetry={retryHandler}
        onCancel={this.onCancel}
      />
    );
  }

  private ensureEditorViewModuleLoaded(props: MainEditorViewProps): void {
    const { editorData, onShowEditorImage } = props;

    if (editorData) {
      const { imageUrl, originalFile } = editorData;

      // Without '&& imageUrl' there will be a lot of frequent attempts to load the editor module:
      //
      // 1) The module can fail to load due to connectivity problems.
      // 2) It calls this._onEditorError.
      // 3) It modifies the state of the app: adds error to editorData and removes imageUrl.
      // 4) This leads to changes of MainEditorView properties and componentWillReceiveProps is called.
      // 5) It calls _ensureEditorViewModuleLoaded which tries to reload the module, most probably unsuccessfully, go to step 2.
      // Checking `&& imageUrl` helps because this becomes undefined after first loading failed.
      //
      // In other words, we try to load the editor module if we have something to dipslay (imageUrl is set).
      if (!editorViewModule && imageUrl) {
        (require as any).ensure(
          ['./editorView/editorView'],
          (require: any) => {
            editorViewModule = require('./editorView/editorView');
            this.setState({ isEditorViewLoaded: true });
          },
          () => {
            const retryHandler = () => {
              onShowEditorImage(imageUrl, originalFile);
            };
            this.onEditorError(couldNotLoadEditor, retryHandler);
          },
        );
      }
    }
  }

  private onEditorError = (
    message: string,
    retryHandler?: () => void,
  ): void => {
    this.props.onShowEditorError({ message, retryHandler });
  };

  private onEditorSave = (originalFile: FileReference) => (
    image: string,
  ): void => {
    const { binaryUploader, onDeselectFile, onCloseEditor } = this.props;

    binaryUploader.upload(image, originalFile.name);
    onDeselectFile(originalFile.id);
    onCloseEditor();
  };

  private onCancel = (): void => {
    this.props.onCloseEditor();
  };
}

export default connect<{}, MainEditorViewDispatchProps, MainEditorViewOwnProps>(
  ({ editorData }: State) => ({
    editorData,
  }),
  dispatch => ({
    onShowEditorImage: (imageUrl, originalFile) =>
      dispatch(editorShowImage(imageUrl, originalFile)),
    onShowEditorError: ({ message, retryHandler }) =>
      dispatch(editorShowError(message, retryHandler)),
    onCloseEditor: () => dispatch(editorClose()),
    onDeselectFile: fileId => dispatch(deselectItem(fileId)),
  }),
)(MainEditorView);
