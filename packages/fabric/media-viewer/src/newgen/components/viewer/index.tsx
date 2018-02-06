import * as React from 'react';
import { Component } from 'react';
import { Toolbar } from './toolbar';
import { ImageViewer, ImageViewerActions } from './viewers/image';
import { Action, ActionType, MediaViewerItemType, ProcessingStatus } from '../../domain';
import { MediaViewerItem } from '../../domain';
import { Annotations } from '../annotations';
import { Error } from './errors';
import { ViewerWrapper } from './styled';

export interface ViewState {
  readonly zoomLevel: number;
  readonly annotate: boolean;
  readonly comment: boolean;
}

export interface ViewProps {
  readonly selectedItem: MediaViewerItem;
}

const getGenericActions = (state: ViewState): Action[] => [
  {
    type: ActionType.ZoomIn,
    text: 'zoom in',
    active: false
  },
  {
    type: ActionType.ZoomOut,
    text: 'zoom out',
    active: false
  },
  {
    type: ActionType.Annotate,
    text: 'annotate',
    active: state.annotate
  }
];

export class View extends Component<ViewProps, ViewState> {
  
  constructor() {
    super();
    this.state = { zoomLevel: 100, annotate: false, comment: false };
  }

  render() {
    const actions: Action[] = getGenericActions(this.state).concat(ImageViewerActions); // will add more actions from other viewers next
    const {selectedItem} = this.props;

    if (selectedItem.processingStatus === ProcessingStatus.Pending) {
      return this.getLoading();
    }

    if (selectedItem.processingStatus === ProcessingStatus.Error) {
      return this.getViewerError(selectedItem);
    }

    const toolbar = (
      <Toolbar 
        onAction={(action: Action) => this.onAction(action)} 
        actions={actions}
      />
    );
    
    const annotations = <Annotations/>;

    return (
      <ViewerWrapper>
        {this.state.annotate && annotations}
        {this.getViewer(selectedItem)}
        {toolbar}
      </ViewerWrapper>
    );
  }

  private getLoading () {
    return <div>I'm a spinner, just use your imagination</div>
  }

  private getViewer(item: MediaViewerItem) {
    switch(item.type){
      case MediaViewerItemType.Image:
        return this.getViewerImage(item);
    }
  }

  private getViewerImage(item: MediaViewerItem) {
    return (
      <ImageViewer 
        zoomLevel={this.state.zoomLevel} 
        url={item.metadata.fullSizeUrl} 
      />   
    )
  }

  private getViewerError(item: MediaViewerItem) {
    return <Error />;
  }

  private onAction(action: Action) {
    switch (action.type) {
      case ActionType.ZoomIn:
        this.setState({ zoomLevel: this.state.zoomLevel + 10 });
        console.log('zoom in');      
        break;
      case ActionType.ZoomOut:
        this.setState({ zoomLevel: this.state.zoomLevel - 10 });
        console.log('zoom out');      
        break;
      case ActionType.Annotate:
        this.setState({ annotate: !this.state.annotate });
        console.log('annotate');      
        break;
      case ActionType.Edit:
        console.log('edit');      
        break;
    }
  }
}
