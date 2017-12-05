import * as React from 'react';
import debounce = require('lodash/debounce');
import Avatar from '@atlaskit/avatar';
import Tooltip from '@atlaskit/tooltip';
import IconImage from '../../../shared/IconImage';
import PreviewImage from '../../../shared/PreviewImage';
import {
  TitleViewModel,
  IconViewModel,
  UserViewModel,
  PreviewViewModel,
  ActionViewModel,
  DetailViewModel,
} from '../../ViewModel';
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
  title?: TitleViewModel;
  icon?: IconViewModel;
  user?: UserViewModel;
  users?: UserViewModel[];
  thumbnail?: PreviewViewModel;
  details?: DetailViewModel[];
  actions?: ActionViewModel[];
  onAction?: (target: any) => void;
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

    return (
      <LeftWrapper>
        <Tooltip content={icon.label}>
          <IconImage src={icon.url} alt={icon.label || ''} size={24} />
        </Tooltip>
      </LeftWrapper>
    );
  }

  renderThumbnail() {
    const { thumbnail } = this.props;

    if (!thumbnail) {
      return null;
    }

    return (
      <LeftWrapper>
        <PreviewImage src={thumbnail.url} />
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
        <Avatar size="medium" src={user.icon.url} name={user.icon.label} />
      </LeftWrapper>
    );
  }

  render() {
    const {
      title: {
        title = {
          text: '',
        },
        text = {
          text: '',
        },
      } = {},
      icon,
      thumbnail,
      user,
      users,
      details,
      actions,
      onAction,
    } = this.props;
    const { width } = this.state;
    return (
      <ContentWrapper innerRef={this.handleMount}>
        <BodyWrapper>
          <TopWrapper>
            {this.renderIcon()}
            {this.renderThumbnail()}
            {this.renderUser()}
            <CopyWrapper>
              <Tooltip content={title.label}>
                <Title>{title.text}</Title>
              </Tooltip>
              <Tooltip content={text.label}>
                <Description>{text.text}</Description>
              </Tooltip>
            </CopyWrapper>
            <Actions
              compact={width && width < 380}
              actions={actions}
              onAction={onAction}
            />
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
