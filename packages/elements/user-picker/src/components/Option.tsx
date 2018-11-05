import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { components } from '@atlaskit/select';
import { colors } from '@atlaskit/theme';
import * as React from 'react';
import styled from 'styled-components';
import { HighlightRange } from '../types';
import { HighlightText } from './HighlightText';

type AvatarTextData = [string, HighlightRange[] | undefined];

interface AvatarText {
  primaryText: AvatarTextData;
  secondaryText?: AvatarTextData;
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

export const TextWrapper = styled.div`
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
        user: { name, nickname, highlight },
      },
    } = this.props;

    const nameData: [string, HighlightRange[]] = [
      name,
      highlight && highlight.name,
    ];
    const nicknameData: [string, HighlightRange[]] = [
      nickname,
      highlight && highlight.nickname,
    ];

    if (name) {
      return {
        primaryText: nameData,
        secondaryText: nicknameData,
      };
    }
    return { primaryText: nicknameData };
  };

  private highlightText = (textData?: AvatarTextData) => {
    const { isSelected } = this.props;
    if (!textData) {
      return undefined;
    }
    const [text, highlights] = textData;
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
    const { primaryText, secondaryText } = this.generateAvatarText();

    return (
      <components.Option {...this.props}>
        <AvatarItem
          backgroundColor="transparent"
          avatar={this.renderAvatar()}
          component={AvatarComponent}
          primaryText={this.highlightText(primaryText)}
          secondaryText={this.highlightText(secondaryText)}
        />
      </components.Option>
    );
  }
}
