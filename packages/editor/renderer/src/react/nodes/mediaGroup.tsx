import * as React from 'react';
import { ReactElement, PureComponent } from 'react';
import { CardEvent, Identifier, LinkIdentifier } from '@atlaskit/media-card';
import { FilmstripView } from '@atlaskit/media-filmstrip';
import { EventHandlers, CardSurroundings } from '@atlaskit/editor-common';
import { MediaProps } from './media';

export interface MediaGroupProps {
  children?: React.ReactNode;
  eventHandlers?: EventHandlers;
}

export interface MediaGroupState {
  animate: boolean;
  offset: number;
}

export default class MediaGroup extends PureComponent<
  MediaGroupProps,
  MediaGroupState
> {
  state: MediaGroupState = {
    animate: false,
    offset: 0,
  };

  private handleSize = ({ offset }) => this.setState({ offset });
  private handleScroll = ({ animate, offset }) =>
    this.setState({ animate, offset });

  render() {
    const numChildren = React.Children.count(this.props.children);

    let content;
    if (numChildren === 1) {
      const card = React.Children.toArray(
        this.props.children,
      )[0] as ReactElement<any>;
      switch (card.props.type) {
        case 'file':
          content = this.renderSingleFile(card);
          break;
        case 'link':
        default:
          content = this.renderSingleLink(card);
      }
    } else {
      content = this.renderStrip();
    }
    return <div className="MediaGroup">{content}</div>;
  }

  renderSingleFile(child: ReactElement<MediaProps>) {
    return React.cloneElement(child, {
      resizeMode: 'full-fit',
      cardDimensions: {
        width: '300px',
        height: '200px',
      },
    } as MediaProps);
  }

  renderSingleLink(child: ReactElement<MediaProps>) {
    return React.cloneElement(child, {
      appearance: 'auto',
    } as MediaProps);
  }

  cloneFileCard(
    child: ReactElement<MediaProps>,
    surroundingItems: Identifier[],
  ) {
    return React.cloneElement(child, {
      resizeMode: 'full-fit',
      eventHandlers: {
        ...child.props.eventHandlers,
        media: {
          onClick: (event: CardEvent, analyticsEvent?: any) => {
            if (
              !this.props ||
              !this.props.eventHandlers ||
              !this.props.eventHandlers.media ||
              !this.props.eventHandlers.media.onClick
            ) {
              return;
            }
            const surroundings: CardSurroundings = {
              collectionName: child.props.collection!,
              list: surroundingItems,
            };
            this.props.eventHandlers.media.onClick(
              event,
              surroundings,
              analyticsEvent,
            );
          },
        },
      },
    } as MediaProps);
  }

  renderStrip() {
    const { children } = this.props;
    const { animate, offset } = this.state;
    const surroundingItems = React.Children.map(
      children,
      (child: ReactElement<MediaProps>) =>
        this.mapMediaPropsToIdentifier(child.props),
    );

    return (
      <FilmstripView
        animate={animate}
        offset={offset}
        onSize={this.handleSize}
        onScroll={this.handleScroll}
      >
        {React.Children.map(children, (child: ReactElement<MediaProps>) => {
          switch (child.props.type) {
            case 'file':
              return this.cloneFileCard(child, surroundingItems);
            case 'link':
            default:
              return React.cloneElement(child);
          }
        })}
      </FilmstripView>
    );
  }

  private mapMediaPropsToIdentifier({
    id,
    type,
    occurrenceKey,
    collection,
  }: MediaProps): Identifier {
    switch (type) {
      case 'file':
        return {
          id: id!,
          mediaItemType: type,
          occurrenceKey,
          collectionName: collection,
        };
      case 'link':
        return {
          id: id!,
          mediaItemType: type,
          occurrenceKey,
          collectionName: collection,
        } as LinkIdentifier;
      case 'external':
        return {
          id: id!,
          mediaItemType: 'file',
          occurrenceKey,
          collectionName: collection,
        };
    }
  }
}
