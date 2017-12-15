import * as React from 'react';
import ViewModel from '../shared/ViewModel';
import CardFrame from '../../shared/CardFrame';
import CardPreview from '../../shared/CardPreview';
import LinkIcon from '../../shared/LinkIcon';
import CardDetails from '../shared/CardDetails';

export interface StandaloneApplicationCardViewProps extends ViewModel {}

export default class StandaloneApplicationCardView extends React.Component<
  StandaloneApplicationCardViewProps
> {
  render() {
    const {
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
      onClick,
    } = this.props;
    return (
      <CardFrame
        minWidth={240}
        maxWidth={Boolean(preview) ? 400 : 664}
        href={link}
        icon={<LinkIcon src={context && context.icon} />}
        text={context && context.text}
        onClick={onClick}
      >
        {preview ? <CardPreview url={preview} /> : null}
        <CardDetails
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
