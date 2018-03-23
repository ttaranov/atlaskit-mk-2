import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Card,
  CardView,
  CardEvent,
  OnLoadingChangeState,
  CardAction,
  CardEventHandler,
} from '@atlaskit/media-card';
import { Context, MediaItem, FileDetails } from '@atlaskit/media-core';

import Spinner from '@atlaskit/spinner';
import Flag, { FlagGroup } from '@atlaskit/flag';
import AnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import EditorInfoIcon from '@atlaskit/icon/glyph/error';

import { Browser } from '../../../..';

import { isImage } from '../../../tools/isImage';
import { isWebGLAvailable } from '../../../tools/webgl';

import { Dropzone } from './dropzone';

import { fileClick } from '../../../actions/fileClick';
import { editorShowImage } from '../../../actions/editorShowImage';
import { editRemoteImage } from '../../../actions/editRemoteImage';
import {
  FileReference,
  LocalUploadFileMetadata,
  LocalUploads,
  Recents,
  SelectedItem,
  State,
} from '../../../domain';

import { menuEdit } from '../editor/phrases';
import { Wrapper, SpinnerWrapper } from './styled';

const createEditCardAction = (handler: CardEventHandler): CardAction => {
  return {
    label: menuEdit,
    handler,
    icon: <AnnotateIcon label={menuEdit} size="small" />,
  };
};

const cardDimension = { width: 162, height: 108 };

export interface UploadViewOwnProps {
  readonly mpBrowser: Browser;
  readonly context: Context;
  readonly recentsCollection: string;
}

export interface UploadViewStateProps {
  readonly isLoading: boolean;
  readonly recents: Recents;
  readonly uploads: LocalUploads;
  readonly selectedItems: SelectedItem[];
  readonly apiUrl: string;
}

export interface UploadViewDispatchProps {
  readonly onFileClick: (
    metadata: LocalUploadFileMetadata,
    serviceName: string,
  ) => void;
  readonly onEditorShowImage: (file: FileReference, dataUri: string) => void;
  readonly onEditRemoteImage: (
    file: FileReference,
    collectionName: string,
  ) => void;
}

export type UploadViewProps = UploadViewOwnProps &
  UploadViewStateProps &
  UploadViewDispatchProps;

export interface UploadViewState {
  readonly imageIds: string[];
  readonly hasPopupBeenVisible: boolean;

  readonly isWebGLWarningFlagVisible: boolean;
  readonly shouldDismissWebGLWarningFlag: boolean;
}

export class StatelessUploadView extends Component<
  UploadViewProps,
  UploadViewState
> {
  state: UploadViewState = {
    imageIds: [],
    hasPopupBeenVisible: false,
    isWebGLWarningFlagVisible: false,
    shouldDismissWebGLWarningFlag: false,
  };

  render() {
    const { isLoading } = this.props;

    if (isLoading) {
      return this.loadingView();
    }

    const cards = this.cards();

    if (cards.length > 0) {
      return this.recentView(cards);
    } else {
      return this.emptyView();
    }
  }

  private loadingView = () => {
    return (
      <SpinnerWrapper>
        <Spinner size="large" />
      </SpinnerWrapper>
    );
  };

  private emptyView() {
    return (
      <Wrapper className="empty">
        <Dropzone mpBrowser={this.props.mpBrowser} />
      </Wrapper>
    );
  }

  private recentView(cards: JSX.Element[]) {
    return (
      <Wrapper>
        <Dropzone mpBrowser={this.props.mpBrowser} />
        <div className="cards">
          <div className="recentUploadsTitle">Recent Uploads</div>
          {cards}
        </div>
        {this.state.isWebGLWarningFlagVisible
          ? this.renderWebGLWarningFlag()
          : null}
      </Wrapper>
    );
  }

  public onAnnotateActionClick(callback: CardEventHandler): CardEventHandler {
    return () => {
      if (isWebGLAvailable()) {
        callback();
      } else {
        this.showWebGLWarningFlag();
      }
    };
  }

  private renderWebGLWarningFlag = (): JSX.Element => (
    <FlagGroup onDismissed={this.onFlagDismissed}>
      <Flag
        shouldDismiss={this.state.shouldDismissWebGLWarningFlag}
        description="Your browser does not support WebGL. Use a WebGL enabled browser to annotate images."
        icon={<EditorInfoIcon label="info" />}
        id="webgl-warning-flag"
        title="You're unable to annotate this image"
        actions={[{ content: 'Learn More', onClick: this.onLearnMoreClicked }]}
      />
    </FlagGroup>
  );

  private cards() {
    const recentFilesCards = this.recentFilesCards();
    const uploadingFilesCards = this.uploadingFilesCards();
    return uploadingFilesCards.concat(recentFilesCards);
  }

  private uploadingFilesCards() {
    const { uploads, onFileClick, onEditorShowImage } = this.props;
    const itemsKeys = Object.keys(uploads);
    itemsKeys.sort((a, b) => {
      return uploads[b].index - uploads[a].index;
    });

    const selectedUploadIds = this.props.selectedItems
      .filter(item => item.serviceName === 'upload')
      .map(item => item.id);

    return itemsKeys.map(key => {
      const item = this.props.uploads[key];
      const { progress, file } = item;
      const { dataURI } = file;

      const mediaType = isImage(file.metadata.mimeType) ? 'image' : 'unknown';
      const metadata = { ...file.metadata, mimeType: mediaType };
      const { id } = metadata;

      const selected = selectedUploadIds.indexOf(id) > -1;
      const status = progress !== null ? 'uploading' : 'complete';
      const onClick = () => onFileClick(metadata, 'upload');

      const actions: CardAction[] = [];
      if (mediaType === 'image' && dataURI) {
        actions.push(
          createEditCardAction(
            this.onAnnotateActionClick(() =>
              onEditorShowImage(metadata, dataURI),
            ),
          ),
        );
      }

      return (
        <div className="cardWrapper" key={id}>
          <CardView
            status={status}
            progress={progress || undefined}
            mediaItemType={'file'}
            metadata={metadata}
            dimensions={cardDimension}
            selectable={true}
            selected={selected}
            dataURI={dataURI}
            onClick={onClick}
            actions={actions}
          />
        </div>
      );
    });
  }

  private recentFilesCards(): JSX.Element[] {
    const {
      context,
      recents,
      recentsCollection,
      selectedItems,
      onFileClick,
      onEditRemoteImage,
    } = this.props;
    const { items } = recents;

    const selectedRecentFiles = selectedItems
      .filter(item => item.serviceName === 'recent_files')
      .map(item => item.id);

    const onClick = ({ mediaItemDetails }: CardEvent) => {
      const fileDetails = mediaItemDetails as FileDetails;
      if (fileDetails && fileDetails.id) {
        onFileClick(
          {
            id: fileDetails.id,
            name: fileDetails.name || '',
            mimeType: fileDetails.mimeType || '',
            size: fileDetails.size || 0,
          },
          'recent_files',
        );
      }
    };
    const onLoadingChange = this.onCardLoadingChanged;
    const editHandler = (mediaItem: MediaItem) => {
      if (mediaItem.type === 'file') {
        const { id, name } = mediaItem.details;

        if (id) {
          if (isWebGLAvailable()) {
            onEditRemoteImage(
              {
                id,
                name: name || '',
              },
              recentsCollection,
            );
          } else {
            // WebGL not available - show warning flag
            this.showWebGLWarningFlag();
          }
        }
      }
    };

    return items.map(item => {
      const { id, occurrenceKey } = item;
      const selected = selectedRecentFiles.indexOf(id) > -1;

      const actions: CardAction[] = [];
      if (this.state.imageIds.indexOf(id) > -1) {
        actions.push(createEditCardAction(editHandler));
      }

      return (
        <div className="cardWrapper" key={`${occurrenceKey}-${id}`}>
          <Card
            context={context}
            identifier={{
              mediaItemType: 'file',
              id: id,
              collectionName: recentsCollection,
            }}
            dimensions={cardDimension}
            selectable={true}
            selected={selected}
            onClick={onClick}
            actions={actions}
            onLoadingChange={onLoadingChange}
          />
        </div>
      );
    });
  }

  private showWebGLWarningFlag() {
    this.setState({ isWebGLWarningFlagVisible: true });
  }

  private onCardLoadingChanged = (cardLoadingState: OnLoadingChangeState) => {
    const payload = cardLoadingState.payload as FileDetails;
    const type = cardLoadingState.type;

    if (
      type === 'complete' &&
      payload &&
      payload.mediaType === 'image' &&
      payload.id
    ) {
      const imageIds = this.state.imageIds.concat(payload.id);
      this.setState({ imageIds });
    }
  };

  private onFlagDismissed = () => {
    this.setState({ isWebGLWarningFlagVisible: false });
  };

  private onLearnMoreClicked = () => {
    this.setState({ shouldDismissWebGLWarningFlag: true });
    this.onFlagDismissed();
    window.open('https://get.webgl.org/');
  };
}

const mapStateToProps = (state: State): UploadViewStateProps => ({
  isLoading: state.view.isLoading,
  recents: state.recents,
  uploads: state.uploads,
  selectedItems: state.selectedItems,
  apiUrl: state.apiUrl,
});

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
): UploadViewDispatchProps => ({
  onFileClick: ({ id, mimeType, name, size }, serviceName) =>
    dispatch(
      fileClick(
        {
          date: 0,
          id,
          mimeType,
          name,
          size,
        },
        serviceName,
      ),
    ),
  onEditorShowImage: (file, dataUri) =>
    dispatch(editorShowImage(dataUri, file)),
  onEditRemoteImage: (file, collectionName) =>
    dispatch(editRemoteImage(file, collectionName)),
});

export default connect<
  UploadViewStateProps,
  UploadViewDispatchProps,
  UploadViewOwnProps
>(mapStateToProps, mapDispatchToProps)(StatelessUploadView);
