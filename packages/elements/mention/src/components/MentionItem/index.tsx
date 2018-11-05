import * as React from 'react';
import Avatar from '@atlaskit/avatar';
import Lozenge from '@atlaskit/lozenge';
import LockCircleIcon from '@atlaskit/icon/glyph/lock-circle';
import Tooltip from '@atlaskit/tooltip';
import { colors } from '@atlaskit/theme';
import {
  HighlightDetail,
  MentionDescription,
  OnMentionEvent,
  Presence,
  isRestricted,
} from '../../types';
import { leftClick } from '../../util/mouse';
import {
  AvatarStyle,
  FullNameStyle,
  InfoSectionStyle,
  MentionItemStyle,
  NicknameStyle,
  NameSectionStyle,
  AccessSectionStyle,
  RowStyle,
  TimeStyle,
} from './styles';

type ReactComponentConstructor = new (props: any) => React.Component<any, any>;

interface Part {
  value: string;
  matches: boolean;
}

function renderHighlight(
  ReactComponent: ReactComponentConstructor,
  value?: string,
  highlights?: HighlightDetail[],
  prefix?: string,
) {
  if (!value) {
    return null;
  }

  const parts: Part[] = [];
  const prefixText = prefix || '';
  let lastIndex = 0;

  if (highlights) {
    for (let i = 0; i < highlights.length; i++) {
      const h = highlights[i];
      const start = h.start;
      const end = h.end;
      if (start > lastIndex) {
        parts.push({
          value: value.substring(lastIndex, start),
          matches: false,
        });
      }
      parts.push({
        value: value.substring(start, end + 1),
        matches: true,
      });
      lastIndex = end + 1;
    }
    if (lastIndex < value.length) {
      parts.push({
        value: value.substring(lastIndex, value.length),
        matches: false,
      });
    }
  } else {
    parts.push({
      value,
      matches: false,
    });
  }

  return (
    <ReactComponent>
      {prefixText}
      {parts.map((part, index) => {
        if (part.matches) {
          return <b key={index}>{part.value}</b>;
        }
        return part.value;
      })}
    </ReactComponent>
  );
}

function renderLozenge(lozenge) {
  if (lozenge) {
    return <Lozenge>{lozenge}</Lozenge>;
  }
  return null;
}

function renderTime(time) {
  if (time) {
    return <TimeStyle>{time}</TimeStyle>;
  }
  return null;
}

export interface Props {
  mention: MentionDescription;
  selected?: boolean;
  onMouseMove?: OnMentionEvent;
  onSelection?: OnMentionEvent;
}

export default class MentionItem extends React.PureComponent<Props, {}> {
  // internal, used for callbacks
  private onMentionSelected = (event: React.MouseEvent<any>) => {
    if (leftClick(event) && this.props.onSelection) {
      event.preventDefault();
      this.props.onSelection(this.props.mention, event);
    }
  };

  private onMentionMenuItemMouseMove = (event: React.MouseEvent<any>) => {
    if (this.props.onMouseMove) {
      this.props.onMouseMove(this.props.mention, event);
    }
  };

  render() {
    const { mention, selected } = this.props;
    const {
      id,
      highlight,
      avatarUrl,
      presence,
      name,
      mentionName,
      nickname,
      lozenge,
      accessLevel,
    } = mention;
    const { status, time } = presence || ({} as Presence);
    const restricted = isRestricted(accessLevel);

    const nameHighlights = highlight && highlight.name;
    const nicknameHighlights = highlight && highlight.nickname;
    const borderColor = selected ? colors.N30 : undefined;

    return (
      <MentionItemStyle
        selected={selected}
        onMouseDown={this.onMentionSelected}
        onMouseMove={this.onMentionMenuItemMouseMove}
        data-mention-id={id}
        data-mention-name={mentionName}
      >
        <RowStyle>
          <AvatarStyle restricted={restricted}>
            <Avatar
              src={avatarUrl}
              size="medium"
              presence={status}
              borderColor={borderColor}
            />
          </AvatarStyle>
          <NameSectionStyle restricted={restricted}>
            {renderHighlight(FullNameStyle, name, nameHighlights)}
            {renderHighlight(NicknameStyle, nickname, nicknameHighlights, '@')}
          </NameSectionStyle>
          <InfoSectionStyle restricted={restricted}>
            {renderLozenge(lozenge)}
            {renderTime(time)}
          </InfoSectionStyle>
          {restricted ? (
            <Tooltip
              content={`${name} won't be notified as they have no access`}
              position="right"
            >
              <AccessSectionStyle>
                <LockCircleIcon label="No access" />
              </AccessSectionStyle>
            </Tooltip>
          ) : null}
        </RowStyle>
      </MentionItemStyle>
    );
  }
}
