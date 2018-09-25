import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import Button from '@atlaskit/button';
import tableMessages from '../../messages';

export interface ButtonProps {
  onClick: () => void;
  lineMarkerHeight?: number;
}

const InsertColumnButton = ({
  onClick,
  lineMarkerHeight,
  intl: { formatMessage },
}: ButtonProps & InjectedIntlProps) => (
  <div className="pm-table-controls__insert-button-wrap">
    <div className="pm-table-controls__insert-button">
      <Button
        onClick={onClick}
        iconBefore={
          <AddIcon label={formatMessage(tableMessages.insertColumn)} />
        }
        appearance="primary"
        spacing="none"
      />
    </div>
    <div
      className="pm-table-controls__insert-line"
      style={{ height: lineMarkerHeight }}
    />
    <div className="pm-table-controls__insert-marker" />
  </div>
);

export default injectIntl(InsertColumnButton);
