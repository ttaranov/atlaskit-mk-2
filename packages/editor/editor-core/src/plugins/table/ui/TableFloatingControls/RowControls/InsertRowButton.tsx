import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import Button from '@atlaskit/button';
import tableMessages from '../../messages';

export interface ButtonProps {
  style?: object;
  onClick: () => void;
  lineMarkerWidth?: number;
  onMouseOver?: () => void;
}

const InsertRowButton = ({
  onMouseOver,
  onClick,
  lineMarkerWidth,
  style,
  intl: { formatMessage },
}: ButtonProps & InjectedIntlProps) => (
  <div
    className="pm-table-controls__insert-button-wrap"
    style={style}
    onMouseOver={onMouseOver}
  >
    <div className="pm-table-controls__insert-button">
      <Button
        onClick={onClick}
        iconBefore={<AddIcon label={formatMessage(tableMessages.insertRow)} />}
        appearance="primary"
        spacing="none"
      />
    </div>
    <div
      className="pm-table-controls__insert-line"
      style={{ width: lineMarkerWidth }}
    />
    <div className="pm-table-controls__insert-marker" />
  </div>
);

export default injectIntl(InsertRowButton);
