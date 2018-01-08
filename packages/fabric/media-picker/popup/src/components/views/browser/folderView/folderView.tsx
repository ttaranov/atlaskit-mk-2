import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as dateformat from 'dateformat'; // ToDo: FIL-3207 | replace dateformat library with native solution
import * as filesize from 'filesize'; // ToDo: FIL-3208 | replace filesize library with native solution
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import { changeCloudAccountFolder } from '../../../../actions/changeCloudAccountFolder';
import { fetchNextCloudFilesPage } from '../../../../actions/fetchNextCloudFilesPage';
import AkButton from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';

/* Actions */
import { fileClick } from '../../../../actions/fileClick';

import {
  isServiceFile,
  isServiceFolder,
  Path,
  SelectedItem,
  ServiceAccountLink,
  ServiceAccountWithType,
  ServiceFile,
  ServiceFolder,
  ServiceFolderItem,
  ServiceName,
  State,
} from '../../../../domain';

/* Components */
import Navigation from '../../../navigation/navigation';
import {
  SpinnerWrapper,
  FolderViewerWrapper,
  FolderViewerRow,
  IconFolderViewerColumn,
  NameFolderViewerColumn,
  DateFolderViewerColumn,
  SizeFolderViewerColumn,
  MoreBtnWrapper,
  FolderViewerContent,
  SelectedFileIconWrapper,
} from './styled';

import { mapMimeTypeToIcon } from '../../../../tools/mimeTypeToIcon';

const getDateString = (timestamp?: number) => {
  if (!timestamp) {
    return '';
  }

  const todayString = new Date().toDateString();
  const itemDate = new Date(timestamp);
  const itemDateString = itemDate.toDateString();

  return dateformat(
    itemDate,
    todayString === itemDateString ? 'H:MM TT' : 'd mmm yyyy',
  );
};

export interface FolderViewerStateProps {
  readonly path: Path;
  readonly accounts: ServiceAccountWithType[];
  readonly service: ServiceAccountLink;
  readonly items: ServiceFolderItem[];
  readonly selectedItems: SelectedItem[];
  readonly loading: boolean;

  readonly currentCursor?: string;
  readonly nextCursor?: string;
}

export interface FolderViewDispatchProps {
  readonly onFolderClick: (
    serviceName: ServiceName,
    accountId: string,
    path: Path,
  ) => void;
  readonly onFileClick: (
    serviceName: ServiceName,
    accountId: string,
    file: ServiceFile,
  ) => void;
  readonly onLoadMoreClick: (
    serviceName: ServiceName,
    accountId: string,
    path: Path,
    nextCursor: string,
  ) => void;
}

export type FolderViewerProps = FolderViewerStateProps &
  FolderViewDispatchProps;

/**
 * Routing class that displays view depending on situation.
 */
export class FolderViewer extends Component<FolderViewerProps, {}> {
  render(): JSX.Element {
    if (this.isPageInitialLoading) {
      return (
        <SpinnerWrapper>
          <Navigation />
          <Spinner size="xlarge" />
        </SpinnerWrapper>
      );
    }

    const folderContent = this.renderFolderContent(this.props.items);
    const moreBtn = this.renderLoadMoreButton();

    return (
      <FolderViewerWrapper>
        <Navigation />
        {folderContent}
        {moreBtn}
      </FolderViewerWrapper>
    );
  }

  private get isPageInitialLoading() {
    return this.props.loading && !this.props.currentCursor;
  }

  private get isPageMoreLoading() {
    return this.props.loading && this.props.currentCursor;
  }

  private renderFolderContent(items: ServiceFolderItem[]): JSX.Element | null {
    if (!items) {
      return null;
    }

    const folderItems = items
      .filter(
        item => item.mimeType.indexOf('application/vnd.google-apps.') === -1,
      )
      .map(item => {
        const itemIcon = mapMimeTypeToIcon(item.mimeType);
        const availableIds = this.props.selectedItems.map(
          selectedItem => selectedItem.id,
        );
        const isSelected = availableIds.indexOf(item.id) > -1;

        if (isServiceFile(item)) {
          return this.renderServiceFile(item, itemIcon, isSelected);
        } else {
          return this.renderServiceFolder(item, itemIcon, isSelected);
        }
      });

    return <FolderViewerContent>{folderItems}</FolderViewerContent>;
  }

  private renderSelectedTick() {
    return (
      <SelectedFileIconWrapper>
        <CheckCircleIcon label="check" />
      </SelectedFileIconWrapper>
    );
  }

  private renderServiceFile(
    serviceFile: ServiceFile,
    itemIcon: JSX.Element,
    isSelected: boolean,
  ): JSX.Element {
    const icon = isSelected ? this.renderSelectedTick() : null;
    return (
      <FolderViewerRow
        isSelected={isSelected}
        onClick={this.itemClicked(serviceFile)}
        key={serviceFile.id}
      >
        <IconFolderViewerColumn>{itemIcon}</IconFolderViewerColumn>
        <NameFolderViewerColumn type="name" isSelected={isSelected}>
          {serviceFile.name}
        </NameFolderViewerColumn>
        <DateFolderViewerColumn type="date" isSelected={isSelected}>
          {getDateString(serviceFile.date)}
        </DateFolderViewerColumn>
        <SizeFolderViewerColumn type="size" isSelected={isSelected}>
          {filesize(serviceFile.size)}
        </SizeFolderViewerColumn>
        {icon}
      </FolderViewerRow>
    );
  }

  private renderServiceFolder(
    item: ServiceFolder,
    itemIcon: JSX.Element,
    isSelected: boolean,
  ): JSX.Element {
    const icon = isSelected ? this.renderSelectedTick() : null;

    return (
      <FolderViewerRow
        isSelected={isSelected}
        onClick={this.itemClicked(item)}
        key={item.id}
      >
        <IconFolderViewerColumn>{itemIcon}</IconFolderViewerColumn>
        <NameFolderViewerColumn isSelected={isSelected}>
          {item.name}
        </NameFolderViewerColumn>
        {icon}
      </FolderViewerRow>
    );
  }

  private renderLoadMoreButton(): JSX.Element | null {
    const { nextCursor, loading } = this.props;

    if (nextCursor || this.isPageMoreLoading) {
      const label = loading ? 'Loading...' : 'Load more';
      return (
        <MoreBtnWrapper>
          <AkButton
            appearance="subtle"
            className="moreBtn"
            onClick={this.onLoadMoreButtonClick}
          >
            {label}
          </AkButton>
        </MoreBtnWrapper>
      );
    } else {
      return null;
    }
  }

  private onLoadMoreButtonClick = (): void => {
    const { service, path, nextCursor, loading, onLoadMoreClick } = this.props;
    if (!loading) {
      onLoadMoreClick(service.name, service.accountId, path, nextCursor || '');
    }
  };

  private itemClicked(item: ServiceFolderItem): () => void {
    return () => {
      const { service, onFolderClick, onFileClick } = this.props;
      if (isServiceFolder(item)) {
        const path = this.props.path.slice();
        path.push({ id: item.id, name: item.name });
        onFolderClick(service.name, service.accountId, path);
      } else {
        onFileClick(service.name, service.accountId, item);
      }
    };
  }
}

export default connect<FolderViewerStateProps, FolderViewDispatchProps, {}>(
  ({ view, accounts, selectedItems }: State) => ({
    path: view.path,
    accounts,
    service: view.service,
    items: view.items,
    selectedItems,
    loading: view.loading,
    currentCursor: view.currentCursor,
    nextCursor: view.nextCursor,
  }),
  dispatch => ({
    onFolderClick: (serviceName, accountId, path) =>
      dispatch(changeCloudAccountFolder(serviceName, accountId, path)),
    onFileClick: (serviceName, accountId, file) =>
      dispatch(fileClick(file, serviceName, accountId)),
    onLoadMoreClick: (serviceName, accountId, path, nextCursor) =>
      dispatch(
        fetchNextCloudFilesPage(serviceName, accountId, path, nextCursor),
      ),
  }),
)(FolderViewer);
