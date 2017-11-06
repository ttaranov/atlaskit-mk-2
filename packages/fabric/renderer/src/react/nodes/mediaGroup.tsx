import * as React from 'react';
import { ReactElement, PureComponent } from 'react';
import { MediaProps } from './media';
import { CardEvent } from '@atlaskit/media-card';
import { FilmstripView } from '@atlaskit/media-filmstrip';
import { CardSurroundings } from '../../ui/Renderer';

export interface MediaGroupProps {
  children?: React.ReactNode;
}

export interface MediaGroupState {
  animate: boolean;
  offset: number;
}

export default class MediaGroup extends PureComponent<MediaGroupProps, MediaGroupState> {

  state: MediaGroupState = {
    animate: false,
    offset: 0
  };

  private handleSize = ({offset}) => this.setState({offset});
  private handleScroll = ({animate, offset}) => this.setState({animate, offset});

  render() {
    const numChildren = React.Children.count(this.props.children);

    if (numChildren === 1) {
      const card = React.Children.toArray(this.props.children)[0] as ReactElement<any>;
      switch (card.props.type) {
        case 'file':
          return this.renderSingleFile(card);

        case 'link':
        default:
          return this.renderSingleLink(card);
      }
    } else {
      return this.renderStrip();
    }
  }

  renderSingleFile(child: ReactElement<MediaProps>) {
    return React.cloneElement(child, {
      resizeMode: 'full-fit'
    } as MediaProps);
  }

  renderSingleLink(child: ReactElement<MediaProps>) {
    return React.cloneElement(child, {
      appearance: 'square'
    } as MediaProps);
  }

  cloneFileCard(child: ReactElement<MediaProps>, listIds: Array<string>) {
    return React.cloneElement(child, {
      resizeMode: 'crop',
      eventHandlers: {
        ...child.props.eventHandlers,
        media: {
          onClick: (event: CardEvent) => {
            if(!child.props
              || !child.props.eventHandlers
              || !child.props.eventHandlers.media
              || !child.props.eventHandlers.media.onClick) {
                return;
              }
            const surroundings: CardSurroundings = {
              collectionName: child.props.collection,
              list: listIds,
            };
            child.props.eventHandlers.media.onClick(event, surroundings);
          }
        }
      }
    } as MediaProps);
  }

  renderStrip() {
    const { children } = this.props;
    const { animate, offset } = this.state;
    const listIds = React.Children.map(children, (child: ReactElement<MediaProps>) => child.props.id);

    return (
      <FilmstripView
        animate={animate}
        offset={offset}
        onSize={this.handleSize}
        onScroll={this.handleScroll}
      >
      {
        React.Children.map(children, (child: ReactElement<MediaProps>) => {
          switch(child.props.type) {
            case 'file':
              return this.cloneFileCard(child, listIds);
            case 'link':
            default:
              return React.cloneElement(child);
          }
        })
      }
      </FilmstripView>
    );
  }
}
