import * as React from 'react';
import ViewModel from './ViewModel';
import { CardFrame, CardPreview, LinkIcon } from '@atlaskit/media-ui';
import { ResolvedView } from '../ResolvedView';

export function minWidth() {
  return 240;
}

export function maxWidth({ hasPreview }: { hasPreview: boolean }) {
  return hasPreview ? 400 : 664;
}

export interface CardViewProps extends ViewModel {}

export interface CardViewState {}

export class CardView extends React.Component<CardViewProps, CardViewState> {
  state: CardViewState = {};

  render() {
    const {
      onClick,
      link,
      context,
      title,
      description,
      icon,
      preview,
      user,
      users,
      details,
      actions,
    } = this.props;
    return (
      <CardFrame
        minWidth={minWidth()}
        maxWidth={maxWidth({ hasPreview: Boolean(preview) })}
        href={link}
        icon={<LinkIcon src={context && context.icon} />}
        text={context && context.text}
        onClick={onClick}
      >
        {preview ? <CardPreview url={preview} /> : null}
        <ResolvedView
          title={title}
          description={description}
          icon={icon}
          user={user}
          users={users}
          details={details}
          actions={actions}
        />
      </CardFrame>
    );
  }
}
