import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
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
      title={formatMessage(tableMessages.removeColumns, { 0: 1 })}
      className={ClassName.CONTROLS_DELETE_BUTTON}
      onClick={onClick}
      onMouseMove={e => e.preventDefault()}
    >
      <svg className={ClassName.CONTROLS_BUTTON_ICON}>
        <path
          d="M12.242 10.828L9.414 8l2.828-2.829a.999.999 0 1 0-1.414-1.414L8 6.587l-2.829-2.83a1 1 0 0 0-1.414 1.414l2.83 2.83-2.83 2.827a1 1 0 0 0 1.414 1.414l2.83-2.828 2.827 2.828a.999.999 0 1 0 1.414-1.414"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </button>
  </div>
);

export default injectIntl(DeleteButton);
