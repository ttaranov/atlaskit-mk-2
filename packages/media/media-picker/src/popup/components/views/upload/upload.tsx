import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Card,
  CardEvent,
  CardAction,
  CardEventHandler,
  FileIdentifier,
} from '@atlaskit/media-card';
import {
  Context,
  MediaItem,
  FileDetails,
  getMediaTypeFromMimeType,
} from '@atlaskit/media-core';
import Spinner from '@atlaskit/spinner';
import Flag, { FlagGroup } from '@atlaskit/flag';
import AnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import EditorInfoIcon from '@atlaskit/icon/glyph/error';
import { FormattedMessage } from 'react-intl';
import { messages, InfiniteScroll } from '@atlaskit/media-ui';
import { Browser } from '../../../../components/browser';
import { isWebGLAvailable } from '../../../tools/webgl';
import { Dropzone } from './dropzone';
import { fileClick } from '../../../actions/fileClick';
import { editorShowImage } from '../../../actions/editorShowImage';
import { editRemoteImage } from '../../../actions/editRemoteImage';
import { setUpfrontIdDeferred } from '../../../actions/setUpfrontIdDeferred';

import {
  FileReference,
  LocalUploadFileMetadata,
  LocalUploads,
  Recents,
  SelectedItem,
  State,
} from '../../../domain';
import { menuEdit } from '../editor/phrases';
import {
  Wrapper,
  SpinnerWrapper,
  LoadingNextPageWrapper,
  CardsWrapper,
  RecentUploadsTitle,
  CardWrapper,
} from './styled';
import { RECENTS_COLLECTION } from '../../../config';

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
  readonly setUpfrontIdDeferred: (
    id: string,
    resolver: (id: string) => void,
    rejecter: Function,
  ) => void;
}

export type UploadViewProps = UploadViewOwnProps &
  UploadViewStateProps &
  UploadViewDispatchProps;

export interface UploadViewState {
  readonly hasPopupBeenVisible: boolean;
  readonly isWebGLWarningFlagVisible: boolean;
  readonly shouldDismissWebGLWarningFlag: boolean;
  readonly isLoadingNextPage: boolean;
}

export class StatelessUploadView extends Component<
  UploadViewProps,
  UploadViewState
> {
  state: UploadViewState = {
    hasPopupBeenVisible: false,
    isWebGLWarningFlagVisible: false,
    shouldDismissWebGLWarningFlag: false,
    isLoadingNextPage: false,
  };

  render() {
    const { isLoading, mpBrowser } = this.props;
    const cards = this.renderCards();
    const isEmpty = !isLoading && cards.length === 0;

    let contentPart: JSX.Element | null = null;
    if (isLoading) {
      contentPart = this.renderLoadingView();
    } else if (!isEmpty) {
      contentPart = this.renderRecentsView(cards);
    }

    return (
      <InfiniteScroll
        height="100%"
        onThresholdReached={this.onThresholdReachedListener}
      >
        <Wrapper>
          <Dropzone isEmpty={isEmpty} mpBrowser={mpBrowser} />
          {contentPart}
        </Wrapper>
      </InfiniteScroll>
    );
  }

  private onThresholdReachedListener = () => {
    const { isLoadingNextPage } = this.state;

    if (isLoadingNextPage) {
      return;
    }

    this.setState({ isLoadingNextPage: true }, async () => {
      try {
        const { context } = this.props;
        await context.collection.loadNextPage(RECENTS_COLLECTION);
      } finally {
        this.setState({ isLoadingNextPage: false });
      }
    });
  };

  private renderLoadingView = () => {
    return (
      <SpinnerWrapper>
        <Spinner size="large" />
      </SpinnerWrapper>
    );
  };

  private renderLoadingNextPageView = () => {
    const { isLoadingNextPage } = this.state;

    // We want to always render LoadingNextPageWrapper regardless of the next page loading or not
    // to keep the same wrapper height, this prevents jumping when interacting with the infinite scroll
    return (
      <LoadingNextPageWrapper>
        {isLoadingNextPage && <Spinner />}
      </LoadingNextPageWrapper>
    );
  };

  private renderRecentsView = (cards: JSX.Element[]) => {
    const { isWebGLWarningFlagVisible } = this.state;

    return (
      <div>
        <RecentUploadsTitle>
          <FormattedMessage {...messages.recent_uploads} />
        </RecentUploadsTitle>
        <CardsWrapper>{cards}</CardsWrapper>
        {this.renderLoadingNextPageView()}
        {isWebGLWarningFlagVisible && this.renderWebGLWarningFlag()}
      </div>
    );
  };

  public onAnnotateActionClick(callback: CardEventHandler): CardEventHandler {
    return () => {
      if (isWebGLAvailable()) {
        callback();
      } else {
        this.showWebGLWarningFlag();
      }
    };
  }
  // TODO [i18n]
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

  private renderCards() {
    const recentFilesCards = this.recentFilesCards();
    const uploadingFilesCards = this.uploadingFilesCards();
    return uploadingFilesCards
      .concat(recentFilesCards)
      .map(({ key, el: card }) => (
        <CardWrapper tabIndex={0} className="e2e-recent-upload-card" key={key}>
          {card}
        </CardWrapper>
      ));
  }

  private uploadingFilesCards(): { key: string; el: JSX.Element }[] {
    const { uploads, onFileClick, context } = this.props;
    const itemsKeys = Object.keys(uploads);
    itemsKeys.sort((a, b) => {
      return uploads[b].index - uploads[a].index;
    });

    const selectedUploadIds = this.props.selectedItems
      .filter(item => item.serviceName === 'upload')
      .map(item => item.id);

    return itemsKeys.map(key => {
      const item = this.props.uploads[key];
      const { file } = item;
      const mediaType = getMediaTypeFromMimeType(file.metadata.mimeType);
      const fileMetadata: LocalUploadFileMetadata = {
        ...file.metadata,
        mimeType: mediaType,
      };
      const { id } = fileMetadata;
      const selected = selectedUploadIds.indexOf(id) > -1;
      const onClick = () => onFileClick(fileMetadata, 'upload');
      const actions: CardAction[] = []; // TODO [MS-1017]: allow file annotation for uploading files
      const { upfrontId } = file.metadata;
      const identifier: FileIdentifier = {
        id: upfrontId,
        mediaItemType: 'file',
      };

      return {
        key: id,
        el: (
          <Card
            context={context}
            identifier={identifier}
            dimensions={cardDimension}
            selectable={true}
            selected={selected}
            onClick={onClick}
            actions={actions}
          />
        ),
      };
    });
  }

  private recentFilesCards(): { key: string; el: JSX.Element }[] {
    const {
      context,
      recents,
      recentsCollection,
      selectedItems,
      onFileClick,
      onEditRemoteImage,
      setUpfrontIdDeferred,
    } = this.props;
    const { items } = recents;
    const selectedRecentFiles = selectedItems
      .filter(item => item.serviceName === 'recent_files')
      .map(item => item.id);

    const onClick = ({ mediaItemDetails }: CardEvent) => {
      const fileDetails = mediaItemDetails as FileDetails;
      if (fileDetails) {
        const { id } = fileDetails;
        const upfrontId = new Promise<string>((resolve, reject) => {
          setUpfrontIdDeferred(id, resolve, reject);
        });

        onFileClick(
          {
            id,
            name: fileDetails.name || '',
            mimeType: fileDetails.mimeType || '',
            size: fileDetails.size || 0,
            upfrontId,
          },
          'recent_files',
        );
      }
    };

    const editHandler: CardEventHandler = (mediaItem?: MediaItem) => {
      if (mediaItem && mediaItem.type === 'file') {
        const { id, name } = mediaItem.details;

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
    };

    return items.map(item => {
      const { id, occurrenceKey, details } = item;
      const selected = selectedRecentFiles.indexOf(id) > -1;
      const actions: CardAction[] = [];

      if ((details as FileDetails).mediaType === 'image') {
        actions.push(createEditCardAction(editHandler));
      }

      return {
        key: `${occurrenceKey}-${id}`,
        el: (
          <Card
            context={context}
            identifier={{
              id,
              mediaItemType: 'file',
              collectionName: recentsCollection,
            }}
            dimensions={cardDimension}
            selectable={true}
            selected={selected}
            onClick={onClick}
            actions={actions}
          />
        ),
      };
    });
  }

  private showWebGLWarningFlag() {
    this.setState({ isWebGLWarningFlagVisible: true });
  }

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
});

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
): UploadViewDispatchProps => ({
  onFileClick: (
    { id, mimeType, name, size, upfrontId, occurrenceKey },
    serviceName,
  ) =>
    dispatch(
      fileClick(
        {
          date: 0,
          id,
          mimeType,
          name,
          size,
          upfrontId,
          occurrenceKey,
        },
        serviceName,
      ),
    ),
  onEditorShowImage: (file, dataUri) =>
    dispatch(editorShowImage(dataUri, file)),
  onEditRemoteImage: (file, collectionName) =>
    dispatch(editRemoteImage(file, collectionName)),
  setUpfrontIdDeferred: (id, resolver, rejecter) =>
    dispatch(setUpfrontIdDeferred(id, resolver, rejecter)),
});

export default connect<
  UploadViewStateProps,
  UploadViewDispatchProps,
  UploadViewOwnProps
>(mapStateToProps, mapDispatchToProps)(StatelessUploadView);
