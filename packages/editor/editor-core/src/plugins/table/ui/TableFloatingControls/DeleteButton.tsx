import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { TableCssClassName as ClassName } from '../../types';
import tableMessages from '../messages';

export interface ButtonProps {
  style?: object;
  onClick?: () => void;
  onMouseEnter?: (SyntheticEvent) => void;
  onMouseLeave?: (SyntheticEvent) => void;
}

const DeleteButton = ({
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  intl: { formatMessage },
}: ButtonProps & InjectedIntlProps) => (
  <div
    className={ClassName.CONTROLS_DELETE_BUTTON_WRAP}
    style={style}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <button
      type="button"
      className={ClassName.CONTROLS_DELETE_BUTTON}
      onClick={onClick}
      onMouseMove={e => e.preventDefault()}
    >
      <span className={ClassName.CONTROLS_BUTTON_ICON}>
        <CrossIcon
          size="small"
          label={formatMessage(tableMessages.removeColumns, { 0: 1 })}
        />
      </span>
    </button>
  </div>
);

export default injectIntl(DeleteButton);
