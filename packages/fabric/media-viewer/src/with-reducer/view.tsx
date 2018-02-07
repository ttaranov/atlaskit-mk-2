import * as React from 'react';
import { Component as NC } from 'react';
import { Toolbar } from '../newgen/components/viewer/toolbar';
import {
  ImageViewer,
  ImageViewerActions,
} from '../newgen/components/viewer/viewers/image';
import {
  Action as ToolbarAction,
  ActionType,
  MediaViewerItemType,
  ProcessingStatus,
} from '../newgen/domain';
import { MediaViewerItem } from '../newgen/domain';
import { Annotations } from '../newgen/components/annotations';
import { Error } from '../newgen/components/viewer/errors';
import { ViewerWrapper } from '../newgen/components/viewer/styled';

export interface State {
  readonly zoomLevel: number;
  readonly annotate: boolean;
  readonly comment: boolean;
  readonly selectedItem: MediaViewerItem;
}

export const getInitState = (selectedItem: MediaViewerItem): State => ({
  zoomLevel: 100,
  annotate: false,
  comment: false,
  selectedItem,
});

export type Action =
  | { type: 'ZOOMIN' }
  | { type: 'ZOOMOUT' }
  | { type: 'ANNOTATE' };

export const reducer = (prevState: State, action: Action): State => {
  switch (action.type) {
    case 'ZOOMIN':
      return { ...prevState, zoomLevel: prevState.zoomLevel + 10 };
    case 'ZOOMOUT':
      return { ...prevState, zoomLevel: prevState.zoomLevel - 10 };
    case 'ANNOTATE':
      return { ...prevState, annotate: !prevState.annotate };
  }
};

export type Props = State & { dispatch: (action: Action) => void };
export const Component = (props: Props) => {
  const actions: ToolbarAction[] = getGenericActions(props).concat(
    ImageViewerActions,
  );
  const { selectedItem, dispatch, annotate } = props;

  if (selectedItem.processingStatus === ProcessingStatus.Pending) {
    return <div>I'm a spinner, just use your imagination</div>;
  }

  if (selectedItem.processingStatus === ProcessingStatus.Error) {
    return <Error />;
  }

  return (
    <ViewerWrapper>
      {annotate && <Annotations />}
      {getViewer(selectedItem, props)}
      <Toolbar
        onAction={(action: ToolbarAction) => onAction(action, dispatch)}
        actions={actions}
      />
    </ViewerWrapper>
  );
};

const getViewer = (item, props) => {
  switch (item.type) {
    case MediaViewerItemType.Image:
      return (
        <ImageViewer
          zoomLevel={props.zoomLevel}
          url={item.metadata.fullSizeUrl}
        />
      );
  }
};

const getGenericActions = (state: State): ToolbarAction[] => [
  {
    type: ActionType.ZoomIn,
    text: 'zoom in',
    active: false,
  },
  {
    type: ActionType.ZoomOut,
    text: 'zoom out',
    active: false,
  },
  {
    type: ActionType.Annotate,
    text: 'annotate',
    active: state.annotate,
  },
];

const onAction = (
  action: ToolbarAction,
  dispatch: (action: Action) => void,
) => {
  switch (action.type) {
    case ActionType.ZoomIn:
      dispatch({ type: 'ZOOMIN' });
      break;
    case ActionType.ZoomOut:
      dispatch({ type: 'ZOOMOUT' });
      break;
    case ActionType.Annotate:
      dispatch({ type: 'ANNOTATE' });
      break;
    case ActionType.Edit:
      break;
  }
};
