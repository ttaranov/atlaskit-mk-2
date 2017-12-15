import * as React from 'react';
import * as debounce from 'lodash.debounce';
import Avatar from '@atlaskit/avatar';
import Tooltip from '@atlaskit/tooltip';
import IconImage from '../../../shared/IconImage';
import PreviewImage from '../../../shared/PreviewImage';
import {
  TextWithTooltip,
  IconWithTooltip,
  UserViewModel,
  ActionViewModel,
  DetailViewModel,
} from '../../shared/ViewModel';
import Users from './Users';
import Actions from './Actions';
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
} from './styled';

export interface CardDetailsProps {
  title?: TextWithTooltip;
  description?: TextWithTooltip;
  icon?: IconWithTooltip;
  user?: UserViewModel;
  users?: UserViewModel[];
  thumbnail?: string;
  details?: DetailViewModel[];
  actions?: ActionViewModel[];
}

export interface CardDetailsState {
  width?: number;
}

export default class CardDetails extends React.Component<
  CardDetailsProps,
  CardDetailsState
> {
  el?: HTMLElement;

  state = {
    width: undefined,
  };

  handleMount = (el: HTMLElement) => {
    if (el) {
      this.el = el;
    }
  };

  handleResize = debounce(() => {
    if (this.el) {
      this.setState({ width: this.el.clientWidth });
    }
  }, 250);

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

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
        <PreviewImage src={thumbnail} />
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
    const { width } = this.state;
    return (
      <ContentWrapper innerRef={this.handleMount}>
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
            <Actions compact={width && width < 384} actions={actions} />
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
