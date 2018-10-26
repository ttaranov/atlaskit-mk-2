import Avatar, { AvatarItem } from '@atlaskit/avatar';
import * as React from 'react';
import { components } from 'react-select';
import styled from 'styled-components';
import { HighlightRange } from '../types';
import { HighlightText } from './HighlightText';

// export interface Props {
//   user: User;
//   status?: 'online' | 'busy' | 'focus' | 'offline';
//   innerRef?: React.Ref<unknown>;
// }

interface AvatarText {
  primaryText: string;
  secondaryText?: string;
}

const AvatarComponent = styled.div`
  padding: 0;
  margin: 0;
  border: none;
  &:hover {
    padding: 0;
    margin: 0;
    border: none;
  }
`;

export class Option extends React.PureComponent<any> {
  private renderAvatar = () => {
    const {
      data: {
        user: { avatarUrl, name },
      },
      status,
    } = this.props;
    return (
      <Avatar src={avatarUrl} size="medium" presence={status} name={name} />
    );
  };

  private generateAvatarText = (): AvatarText => {
    const {
      data: {
        user: { name, nickname },
      },
    } = this.props;
    if (name) {
      return {
        primaryText: name,
        secondaryText: nickname,
      };
    }
    return { primaryText: nickname };
  };

  private highlightText = (text?: string, highlights?: HighlightRange[]) => {
    if (!text) {
      return undefined;
    }
    if (!highlights) {
      return text;
    }
    return <HighlightText highlights={highlights}>{text}</HighlightText>;
  };

  render() {
    const {
      data: {
        user: { highlight },
      },
    } = this.props;
    const primaryHighlights = highlight && highlight.name;
    const secondaryHighlights = highlight && highlight.nickname;
    const { primaryText, secondaryText } = this.generateAvatarText();

    return (
      <components.Option {...this.props}>
        <AvatarItem
          backgroundColor="transparent"
          avatar={this.renderAvatar()}
          component={AvatarComponent}
          primaryText={this.highlightText(primaryText, primaryHighlights)}
          secondaryText={this.highlightText(secondaryText, secondaryHighlights)}
        />
      </components.Option>
    );
  }
}
