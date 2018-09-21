import * as React from 'react';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import AkButton from '@atlaskit/button';

export interface ButtonProps {
  onClick: () => void;
  lineMarkerHeight?: number;
}

const InsertColumnButton = ({ onClick, lineMarkerHeight }: ButtonProps) => (
  <div className="pm-table-controls__insert-button-wrap">
    <div className="pm-table-controls__insert-button">
      <AkButton
        onClick={onClick}
        iconBefore={<AddIcon label="Add column" />}
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

export default InsertColumnButton;
