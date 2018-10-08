import * as React from 'react';
import { SyntheticEvent } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { TableCssClassName as ClassName } from '../../types';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import tableMessages from '../messages';

export interface ButtonProps {
  type: 'row' | 'column';
  index: number;
  showInsertButton?: boolean;
  onMouseDown: (event: SyntheticEvent<HTMLButtonElement>) => void;
}

const InsertButton = ({
  onMouseDown,
  index,
  showInsertButton,
  type,
  intl: { formatMessage },
}: ButtonProps & InjectedIntlProps) => (
  <div
    data-index={index}
    className={`${ClassName.CONTROLS_INSERT_BUTTON_WRAP} ${
      type === 'row'
        ? ClassName.CONTROLS_INSERT_ROW
        : ClassName.CONTROLS_INSERT_COLUMN
    }`}
  >
    {showInsertButton && (
      <>
        <div className={ClassName.CONTROLS_INSERT_BUTTON_INNER}>
          <button
            type="button"
            className={ClassName.CONTROLS_INSERT_BUTTON}
            onMouseDown={onMouseDown}
          >
            <span className={ClassName.CONTROLS_BUTTON_ICON}>
              <AddIcon
                label={formatMessage(
                  type === 'row'
                    ? tableMessages.insertRow
                    : tableMessages.insertColumn,
                )}
              />
            </span>
          </button>
        </div>
        {type === 'row' && (
          <div className={ClassName.ROW_INSERT_LINE_OVERLAY} />
        )}
      </>
    )}
    <div className={ClassName.CONTROLS_INSERT_MARKER} />
  </div>
);

export default injectIntl(InsertButton);
