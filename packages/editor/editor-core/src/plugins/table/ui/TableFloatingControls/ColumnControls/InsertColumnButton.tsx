import * as React from 'react';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import AkButton from '@atlaskit/button';
import {
  InsertColumnButtonWrap,
  InsertColumnMarker,
  InsertColumnButtonInner,
  ColumnLineMarker,
} from './styles';

export interface ButtonProps {
  style?: object;
  onClick: () => void;
  lineMarkerHeight?: number;
}

const InsertColumnButton = ({
  style,
  onClick,
  lineMarkerHeight,
}: ButtonProps) => (
  <InsertColumnButtonWrap style={style}>
    <InsertColumnButtonInner>
      <AkButton
        onClick={onClick}
        iconBefore={<AddIcon label="Add column" />}
        appearance="primary"
        spacing="none"
      />
    </InsertColumnButtonInner>
    <ColumnLineMarker style={{ height: lineMarkerHeight }} />
    <InsertColumnMarker />
  </InsertColumnButtonWrap>
);

export default InsertColumnButton;
