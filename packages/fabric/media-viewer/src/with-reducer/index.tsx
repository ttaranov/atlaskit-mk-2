import * as React from 'react';

import { MediaItemType } from '@atlaskit/media-core';
import {
  MediaViewerItemType,
  MediaViewerItem,
  ProcessingStatus,
} from '../newgen/domain/index';
import {
  MainWrapper,
  HeaderWrapper,
  FooterWrapper,
} from '../newgen/components/mediaviewer/styled';
import { Header } from '../newgen/components/header/';
import { Footer } from '../newgen/components/footer/';
import * as view from './view';
import { Navigation } from '../newgen/components/navigation';

const item = {
  identifier: {
    id: '1',
    occurrenceKey: '',
    collection: 'col1',
    mediaItemType: 'file' as MediaItemType,
  },
  processingStatus: ProcessingStatus.Processed,
  metadata: {
    fullSizeUrl: 'https://picsum.photos/500/300?image=0',
  },
  type: MediaViewerItemType.Image,
};

const itemPending = {
  identifier: {
    id: '2',
    occurrenceKey: '',
    collection: 'col1',
    mediaItemType: 'file' as MediaItemType,
  },
  processingStatus: ProcessingStatus.Pending,
  metadata: {
    fullSizeUrl: 'https://picsum.photos/500/300?image=1',
  },
  type: MediaViewerItemType.Image,
};

export type State =
  | {
      readonly state: 'loading';
    }
  | {
      readonly state: 'ready';
      readonly items: MediaViewerItem[];
      readonly selectedItem: MediaViewerItem;
      readonly view: view.State;
    }
  | {
      readonly state: 'error';
      readonly msg: string;
    };

export const initState: State = {
  state: 'ready',
  items: [item, itemPending],
  selectedItem: item,
  view: view.getInitState(item),
};

export type Action =
  | {
      readonly type: 'NAVIGATE';
      readonly selectedItem: MediaViewerItem;
      readonly index: number;
      readonly total: number;
    }
  | {
      readonly type: 'READY';
      readonly items: MediaViewerItem[];
      readonly selectedItem: MediaViewerItem;
    }
  | {
      readonly type: 'VIEW';
      readonly wrapped: view.Action;
    }
  | {
      readonly type: 'LOAD_COLLECTION';
    }
  | {
      readonly type: 'LOAD_COLLECTION_FAILURE';
      readonly err: Error;
    }
  | {
      readonly type: 'LOAD_COLLECTION_SUCCESS';
      readonly collection: MediaViewerItem[];
    };

export const reducer = (prevState: State, action: Action): State => {
  switch (action.type) {
    case 'NAVIGATE':
      return prevState.state === 'ready'
        ? { ...prevState, selectedItem: action.selectedItem }
        : prevState;
    case 'READY':
      return {
        state: 'ready',
        items: action.items,
        selectedItem: action.selectedItem,
        view: view.getInitState(action.selectedItem),
      };
    case 'VIEW':
      return prevState.state === 'ready'
        ? { ...prevState, view: view.reducer(prevState.view, action.wrapped) }
        : prevState;
    case 'LOAD_COLLECTION':
      return prevState;
    case 'LOAD_COLLECTION_SUCCESS':
      return {
        state: 'ready',
        items: action.collection,
        selectedItem: action.collection[0],
        view: view.getInitState(item),
      };
    case 'LOAD_COLLECTION_FAILURE':
      return { state: 'loading' };
  }
};

export type Props = { dispatch: (action: Action) => void } & State;
export const Component = (props: Props) => {
  switch (props.state) {
    case 'loading':
      return <div>loading</div>;
    case 'ready':
      return (
        <MainWrapper>
          <HeaderWrapper>
            <Header item={props.selectedItem} />
          </HeaderWrapper>
          <view.Component
            {...props.view}
            dispatch={action =>
              props.dispatch({ type: 'VIEW', wrapped: action })
            }
          />
          <FooterWrapper>
            <Footer item={props.selectedItem} />
          </FooterWrapper>
          <Navigation
            onNavigate={(
              selectedItem: MediaViewerItem,
              index: number,
              total: number,
            ) =>
              props.dispatch({ type: 'NAVIGATE', selectedItem, index, total })
            }
            items={props.items}
            selectedItem={props.selectedItem}
          />
        </MainWrapper>
      );
    case 'error':
      return <div>ouch {props.msg}</div>;
  }
};
