import * as React from 'react';
import { Component } from 'react';
import { Context } from '@atlaskit/media-core';

import { MainWrapper, HeaderWrapper, FooterWrapper } from './styled';
import { Header } from './components/header/';
import { Footer } from './components/footer/';
import { View } from './components/viewer';
import {MediaViewerDataSource} from '../';
import {WithCollection} from './components/data/with-collection';
import {Navigation} from './components/navigation';
import { MediaItemIdentifier, MediaViewerItem } from './domain/index';

export interface MediaViewerState {
  readonly selectedItem: MediaViewerItem;
}

export interface MediaViewerProps {
  readonly context: Context;
  readonly selectedItemId: MediaItemIdentifier; // selectedItemId instead?
  readonly dataSource: MediaViewerDataSource;
}


export class MediaViewer extends Component<MediaViewerProps, MediaViewerState> {

  renderMain(selectedIdentifier: MediaItemIdentifier) {
    const {context, dataSource} = this.props;
    
    return (
      <WithCollection context={context} selectedItemId={selectedIdentifier} dataSource={dataSource}>

        {/* // this child */}

        {(items: MediaViewerItem[], selectedItem: MediaViewerItem) => (
          
          <MainWrapper>

            <HeaderWrapper>
              <Header item={selectedItem} />
            </HeaderWrapper>

            <View selectedItem={selectedItem}/>
            
            <FooterWrapper>
              <Footer item={selectedItem} />
            </FooterWrapper>

            <Navigation 
              onNavigate={(selectedItem: MediaViewerItem, index: number, total: number) => this.onNavigate(selectedItem, index, total)} 
              items={items} 
              selectedItem={selectedItem} 
            />

          </MainWrapper>      
        )}

      </WithCollection>
    );
  }

  render() {
    const selectedId = (this.state && this.state.selectedItem) ? this.state.selectedItem.identifier : this.props.selectedItemId;
    return this.renderMain(selectedId);
  }

  private onNavigate(selectedItem: MediaViewerItem, index: number, total: number) {
    console.log('onNavigate', selectedItem, index, total);    
    this.setState({selectedItem});
  }
}