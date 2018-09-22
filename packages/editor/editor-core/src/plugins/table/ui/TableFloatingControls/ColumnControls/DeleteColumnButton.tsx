import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Button from '@atlaskit/button';
import tableMessages from '../../messages';

export interface ButtonProps {
  style?: object;
  onClick?: () => void;
  onMouseEnter?: (SyntheticEvent) => void;
  onMouseLeave?: (SyntheticEvent) => void;
}

class DeleteColumnButton extends React.Component<
  ButtonProps & InjectedIntlProps
> {
  state = { hover: false };
  static defaultProps = {
    onMouseEnter: () => {},
    onMouseLeave: () => {},
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
    const {
      style,
      onClick,
      intl: { formatMessage },
    } = this.props;
    const labelRemoveColumn = formatMessage(tableMessages.removeColumns, {
      0: 1,
    });
    return (
      <div
        className="pm-table-controls__delete-button-wrap"
        style={style}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Button
          onClick={onClick}
          iconBefore={<CrossIcon size="small" label={labelRemoveColumn} />}
          appearance={this.state.hover ? 'danger' : 'default'}
          spacing="none"
        />
      </div>
    );
  }
}

export default injectIntl(DeleteColumnButton);
