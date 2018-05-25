import * as React from 'react';
import Avatar from '@atlaskit/avatar';
import Tooltip from '@atlaskit/tooltip';
import { IconImage } from '@atlaskit/media-ui';
import {
  TextWithTooltip,
  IconWithTooltip,
  UserViewModel,
  DetailViewModel,
} from '../CardView/ViewModel';
import Users from './Users';
import Widgets from './Widgets';
import {
  ContentWrapper,
  LeftWrapper,
  BodyWrapper,
  TopWrapper,
  BottomWrapper,
  CopyWrapper,
  Title,
  Description,
  Thumbnail,
} from './styled';

export interface DetailViewProps {
  title?: TextWithTooltip;
  description?: TextWithTooltip;
  icon?: IconWithTooltip;
  user?: UserViewModel;
  users?: UserViewModel[];
  thumbnail?: string;
  details?: DetailViewModel[];
  actions?: React.ReactNode;
}

export interface DetailViewState {}

export class ResolvedView extends React.Component<
  DetailViewProps,
  DetailViewState
> {
  el?: HTMLElement;

  renderIcon() {
    const { icon } = this.props;

    if (!icon) {
      return null;
    }

    // TODO: handle if there is an error loading the image -> show the placeholder
    return (
      <LeftWrapper>
        <Tooltip content={icon.tooltip}>
          <IconImage src={icon.url} size={24} />
        </Tooltip>
      </LeftWrapper>
    );
  }

  renderThumbnail() {
    const { thumbnail } = this.props;

    if (!thumbnail) {
      return null;
    }

    // TODO: handle if there is an error loading the image -> show the placeholder
    return (
      <LeftWrapper>
        <Thumbnail src={thumbnail} />
      </LeftWrapper>
    );
  }

  renderUser() {
    const { user } = this.props;

    if (!user) {
      return null;
    }

    return (
      <LeftWrapper>
        <Avatar size="medium" src={user.icon} name={user.name} />
      </LeftWrapper>
    );
  }

  render() {
    const {
      title,
      description,
      icon,
      thumbnail,
      user,
      users,
      details,
      actions,
    } = this.props;
    return (
      <ContentWrapper>
        <BodyWrapper>
          <TopWrapper>
            {this.renderIcon()}
            {!icon && this.renderUser()}
            {!icon && !user && this.renderThumbnail()}
            <CopyWrapper>
              <Tooltip content={title ? title.tooltip : undefined}>
                <Title>{title ? title.text : undefined}</Title>
              </Tooltip>
              <Tooltip content={description ? description.tooltip : undefined}>
                <Description>
                  {description ? description.text : undefined}
                </Description>
              </Tooltip>
            </CopyWrapper>
            {actions}
          </TopWrapper>
          <BottomWrapper padLeft={Boolean(icon || thumbnail || user)}>
            <Widgets details={details} />
            <Users users={users} />
          </BottomWrapper>
        </BodyWrapper>
      </ContentWrapper>
    );
  }
}
