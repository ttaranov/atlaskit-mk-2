import * as React from 'react';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import AkButton from '@atlaskit/button';
import AkTooltip from '@atlaskit/tooltip';
import { DeleteColumnButtonWrap } from './styles';
import { InsertButtonDefault as InsertButton } from '../styles';
import { intlShape } from 'react-intl';
import { messages } from '@atlaskit/editor-common';

export interface ButtonProps {
  style?: object;
  onClick?: () => void;
  onMouseEnter?: (SyntheticEvent) => void;
  onMouseLeave?: (SyntheticEvent) => void;
}

class DeleteColumnButton extends React.Component<ButtonProps> {
  state = { hover: false };
  static defaultProps = {
    onMouseEnter: () => {},
    onMouseLeave: () => {},
  };

  static contextTypes = {
    intl: intlShape,
  };

  onMouseEnter = e => {
    this.setState({ hover: true });
    this.props.onMouseEnter!(e);
  };

  onMouseLeave = e => {
    this.setState({ hover: false });
    this.props.onMouseLeave!(e);
  };

  render() {
    const { style, onClick } = this.props;
    const { formatMessage } = this.context.intl;
    let title = formatMessage(messages.table_remove_column);

    return (
      <DeleteColumnButtonWrap
        style={style}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <InsertButton>
          <AkTooltip content={title} position="top">
            <AkButton
              onClick={onClick}
              iconBefore={<CrossIcon size="small" label={title} />}
              appearance={this.state.hover ? 'danger' : 'default'}
              spacing="none"
            />
          </AkTooltip>
        </InsertButton>
      </DeleteColumnButtonWrap>
    );
  }
}

export default DeleteColumnButton;
