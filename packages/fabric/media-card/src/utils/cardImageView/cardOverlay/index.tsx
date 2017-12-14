import * as React from 'react';
import { MouseEvent, Component } from 'react';
import { MediaType, CardAction, CardEventHandler } from '@atlaskit/media-core';
import TickIcon from '@atlaskit/icon/glyph/check';
// We dont require things directly from "utils" to avoid circular dependencies
import { FileIcon } from '../../fileIcon';
import { ErrorIcon } from '../../errorIcon';
import { Ellipsify } from '../../ellipsify';
import { Menu } from '../../menu';

import {
  TickBox,
  Overlay,
  ErrorLine,
  LeftColumn,
  TopRow,
  BottomRow,
  RightColumn,
  ErrorMessage,
  Retry,
  TitleWrapper,
  Subtitle,
  Metadata,
  ErrorWrapper,
} from './styled';

export interface CardOverlayProps {
  mediaType?: MediaType;
  mediaName?: string;
  subtitle?: string;

  selectable?: boolean;
  selected?: boolean;
  persistent: boolean;

  error?: string;
  onRetry?: () => void;

  actions?: Array<CardAction>;
  icon?: string;
}

export interface CardOverlayState {
  isMenuExpanded: boolean;
}

export class CardOverlay extends Component<CardOverlayProps, CardOverlayState> {
  static defaultProps = {
    actions: [],
    mediaName: '',
  };

  constructor(props: CardOverlayProps) {
    super(props);

    this.state = {
      isMenuExpanded: false,
    };
  }

  render() {
    const {
      error,
      mediaName,
      persistent,
      actions,
      selectable,
      selected,
      mediaType,
    } = this.props;
    const { isMenuExpanded } = this.state;
    const titleText = error || !mediaName ? '' : mediaName;
    const menuTriggerColor = !persistent ? 'white' : undefined;

    return (
      <Overlay
        hasError={!!error}
        mediaType={mediaType}
        isSelectable={selectable}
        isSelected={selected}
        isPersistent={!persistent}
        isActive={isMenuExpanded}
        className="overlay"
      >
        <TopRow
          isActive={isMenuExpanded}
          isPersistent={!persistent}
          className="top-row"
        >
          {this.errorLine()}
          <TitleWrapper isPersistent={!persistent} className="title">
            <Ellipsify text={titleText} lines={2} />
          </TitleWrapper>
          {this.tickBox()}
        </TopRow>
        <BottomRow className="bottom-row">
          <LeftColumn>{this.bottomLeftColumn()}</LeftColumn>
          <RightColumn>
            <Menu
              actions={actions}
              onToggle={this.onMenuToggle}
              triggerColor={menuTriggerColor}
            />
          </RightColumn>
        </BottomRow>
      </Overlay>
    );
  }

  errorLine() {
    const error = this.props.error;
    return (
      error && (
        <ErrorLine>
          <ErrorMessage>{this.props.error}</ErrorMessage>
        </ErrorLine>
      )
    );
  }

  tickBox() {
    const { selected, selectable } = this.props;
    const tick = <TickIcon label="tick" />;

    return (
      selectable && (
        <TickBox className="tickbox" isSelected={selected}>
          {' '}
          {tick}{' '}
        </TickBox>
      )
    );
  }

  bottomLeftColumn() {
    const { error, onRetry } = this.props;

    if (error) {
      if (!onRetry) {
        return <ErrorIcon />;
      }

      return (
        <ErrorWrapper>
          <ErrorIcon />
          <Retry onClick={onRetry}>Retry</Retry>
        </ErrorWrapper>
      );
    } else {
      const { mediaType, subtitle, icon } = this.props;
      const fileIcon =
        mediaType || icon ? (
          <FileIcon mediaType={mediaType} iconUrl={icon} />
        ) : null;

      const subtitleEl = subtitle ? (
        <Subtitle className="file-size">{subtitle}</Subtitle>
      ) : null;

      return (
        <div>
          <Metadata className="metadata">
            {fileIcon}
            {subtitleEl}
          </Metadata>
        </div>
      );
    }
  }

  onMenuToggle = (attrs: { isOpen: boolean }) => {
    this.setState({ isMenuExpanded: attrs.isOpen });
  };

  removeBtnClick(handler: CardEventHandler) {
    return (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      handler();
    };
  }
}
