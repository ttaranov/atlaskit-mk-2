import * as React from 'react';
import { Component } from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';

import { MediaViewerRenderer } from '../src/newgen/components/mediaviewer';
import { MediaItemIdentifier } from '../src/newgen/domain';
import { MediaItemType } from '@atlaskit/media-core';
import { MockWithCollection } from '../example-helpers/with-collection1';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';

const context = createStorybookContext() as any;
const dataSource = {
  collectionName: defaultCollectionName,
};

const mockWithCollection = ({ children, selectedItemId }) => (
  <MockWithCollection
    context={context}
    selectedItemId={selectedItemId}
    dataSource={dataSource}
  >
    {children}
  </MockWithCollection>
);

const selectedItemId: MediaItemIdentifier = {
  id: '1',
  occurrenceKey: '',
  mediaItemType: 'file' as MediaItemType,
};

interface MediaViewerOpeningProps {}
interface MediaViewerOpeningState {
  open: boolean;
}

interface TransitionWrapperProps {
  open: boolean;
}
interface TransitionWrapperState {}

class TransitionWrapper extends Component<TransitionWrapperProps, TransitionWrapperState> {

  render() {
    const duration = 100;

    const defaultStyle = {
      transition: `all ${duration}ms ease-in-out`,
      opacity: 0,
      left: '100px',
      top: '0px',
      transform: 'scale(0.2)',
      position: 'absolute'
    }
    
    const transitionStyles = {
      entering: { opacity: 0, top: '0px', left: '100px', transform: 'scale(0.2)' },
      entered:  { opacity: 1, top: '100px',  left: '200px', transform: 'scale(1)' },
    };

    return (
      <Transition in={this.props.open} timeout={duration}>
      
      {(state) => {
        return (
          <div style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}>
            <MediaViewerRenderer
                selectedItemId={selectedItemId}
                DataComponent={mockWithCollection}
            />
          </div>
        );
      }}      
  
      </Transition>
    );
  }
}

class MediaViewerOpening extends Component<MediaViewerOpeningProps, MediaViewerOpeningState> {

  constructor(props){
    super(props);
    this.state = { open: false };
  }

  toggleOpen () {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div>
        
        <button 
          onClick={() => this.toggleOpen()}
        >Open/Close MediaViewer</button>

        <TransitionWrapper open={this.state.open}/>
      </div>
    );
  }
} 

export default () => <MediaViewerOpening/>;
