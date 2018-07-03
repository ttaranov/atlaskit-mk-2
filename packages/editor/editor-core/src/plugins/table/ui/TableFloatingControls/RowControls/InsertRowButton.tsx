import * as React from 'react';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import AkButton from '@atlaskit/button';
import {
  InsertRowButtonWrap,
  InsertRowMarker,
  InsertRowButtonInner,
  RowLineMarker,
} from './styles';

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
  <InsertRowButtonWrap style={style} onMouseOver={onMouseOver}>
    <InsertRowButtonInner>
      <AkButton
        onClick={onClick}
        iconBefore={<AddIcon label="Add row" />}
        appearance="primary"
        spacing="none"
      />
    </InsertRowButtonInner>
    <RowLineMarker
      style={{ width: lineMarkerWidth }}
      className="ProseMirror-table-insert-row-marker"
    />
    <InsertRowMarker />
  </InsertRowButtonWrap>
);

export default InsertRowButton;
