import * as React from 'react';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import AkButton from '@atlaskit/button';

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
}: ButtonProps) => (
  <div
    className="pm-table-controls__insert-button-wrap"
    style={style}
    onMouseOver={onMouseOver}
  >
    <div className="pm-table-controls__insert-button">
      <AkButton
        onClick={onClick}
        iconBefore={<AddIcon label="Add row" />}
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

export default InsertRowButton;
