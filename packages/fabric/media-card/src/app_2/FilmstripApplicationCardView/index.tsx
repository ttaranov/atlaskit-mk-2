import * as React from 'react';
import ViewModel from '../shared/ViewModel';
import CardFrame from '../../shared/CardFrame';
import LinkIcon from '../../shared/LinkIcon';
import CardDetails from '../shared/CardDetails';

/*

  This card is currently not exported and is not used internally. It will be used in the future
  when smart-cards can be displayed in the Filmstrip. This card does not have a preview and has
  a smaller width than other smart-cards.

*/

export interface FilmstripApplicationCardViewProps extends ViewModel {}

export default class FilmstripApplicationCardView extends React.Component<
  FilmstripApplicationCardViewProps
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
        maxWidth={400}
        href={link}
        icon={<LinkIcon src={context && context.icon} />}
        text={context && context.text}
        onClick={onClick}
      >
        <CardDetails
          title={title}
          description={description}
          icon={icon}
          user={user}
          thumbnail={preview}
          users={users}
          actions={actions}
          details={details}
        />
      </CardFrame>
    );
  }
}
