import * as React from 'react';
import { Component } from 'react';
import { MediaItemIdentifier, MediaViewerItem } from '../../domain/index';
import { MainWrapper, HeaderWrapper, FooterWrapper } from './styled';
import { Header } from '../../components/header/';
import { Footer } from '../../components/footer/';
import { View } from '../../components/viewer';
import { Navigation } from '../../components/navigation';

export interface MediaViewerRendererState {
    readonly selectedItem: MediaViewerItem;
  }
  
  export interface MediaViewerRendererProps {
    readonly selectedItemId: MediaItemIdentifier; // selectedItemId instead?
    readonly DataComponent: any;
  }
  
  export class MediaViewerRenderer extends Component<MediaViewerRendererProps, MediaViewerRendererState> { 
  
    renderMain(selectedIdentifier: MediaItemIdentifier) {
      const {DataComponent} = this.props;
      return <DataComponent selectedItemId={selectedIdentifier}>
  
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
  
      </DataComponent>
    }
  
    render() {
      const selectedId = (this.state && this.state.selectedItem) ? this.state.selectedItem.identifier : this.props.selectedItemId;
      console.log('selectedId:', selectedId);    
      return this.renderMain(selectedId);
    }
  
    private onNavigate(selectedItem: MediaViewerItem, index: number, total: number) {
      console.log('onNavigate', selectedItem, index, total);    
      this.setState({selectedItem});
    }
  }