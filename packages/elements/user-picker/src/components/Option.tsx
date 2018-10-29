import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { components } from '@atlaskit/select';
import { colors } from '@atlaskit/theme';
import * as React from 'react';
import styled from 'styled-components';
import { HighlightRange } from '../types';
import { HighlightText } from './HighlightText';

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

const TextWrapper = styled.div`
  color: ${({ color }) => color};
  overflow: hidden;
  text-overflow: ellipsis;
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
      <Avatar
        src={avatarUrl}
        size="medium"
        presence={status}
        name={name}
        isHover={false}
      />
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
    const { isSelected } = this.props;
    if (!text) {
      return undefined;
    }
    return (
      <TextWrapper color={isSelected ? colors.N0 : colors.N800}>
        {highlights ? (
          <HighlightText highlights={highlights}>{text}</HighlightText>
        ) : (
          text
        )}
      </TextWrapper>
    );
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
