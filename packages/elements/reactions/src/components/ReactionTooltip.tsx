import Tooltip from '@atlaskit/tooltip';
import * as React from 'react';
import { style } from 'typestyle';
import { ReactionSummary } from '../types/ReactionSummary';

const tooltipStyle = style({
  maxWidth: '150px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  $nest: {
    ul: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      textAlign: 'left',
    },
    li: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginTop: 0,
    },
  },
});

const emojiNameStyle = style({
  textTransform: 'capitalize',
  marginBottom: 5,
});

const footerStyle = style({
  marginTop: 5,
});

export interface Props {
  emojiName?: string;
  reaction: ReactionSummary;
  children: React.ReactNode;
}

const TOOLTIP_USERS_LIMIT = 5;

export const ReactionTooltip = ({
  emojiName,
  children,
  reaction: { users },
}: Props) => {
  const content =
    users && users.length > 0 ? (
      <div className={tooltipStyle}>
        {emojiName ? <span className={emojiNameStyle}>{emojiName}</span> : null}
        <ul>
          {users.slice(0, TOOLTIP_USERS_LIMIT).map((user, index) => {
            return <li key={index}>{user.displayName}</li>;
          })}
        </ul>
        {users.length > TOOLTIP_USERS_LIMIT ? (
          <span className={footerStyle}>
            +{users.length - TOOLTIP_USERS_LIMIT}...
          </span>
        ) : null}
      </div>
    ) : (
      undefined
    );

  return (
    <Tooltip content={content} position="bottom">
      {React.Children.only(children)}
    </Tooltip>
  );
};
