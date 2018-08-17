import * as React from 'react';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import AkButton from '@atlaskit/button';
import AkTooltip from '@atlaskit/tooltip';
import {
  InsertColumnButtonWrap,
  InsertColumnMarker,
  InsertColumnButtonInner,
  ColumnLineMarker,
} from './styles';
import { intlShape } from 'react-intl';
import { messages } from '@atlaskit/editor-common';

export interface ButtonProps {
  onClick: () => void;
  lineMarkerHeight?: number;
}

class InsertColumnButton extends React.PureComponent<ButtonProps> {
  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { onClick, lineMarkerHeight } = this.props;
    const { formatMessage } = this.context.intl;
    let title = formatMessage(messages.table_add_column);

    return (
      <InsertColumnButtonWrap>
        <InsertColumnButtonInner>
          <AkTooltip content={title} position="top">
            <AkButton
              onClick={onClick}
              iconBefore={<AddIcon label={title} />}
              appearance="primary"
              spacing="none"
            />
          </AkTooltip>
        </InsertColumnButtonInner>
        <ColumnLineMarker style={{ height: lineMarkerHeight }} />
        <InsertColumnMarker />
      </InsertColumnButtonWrap>
    );
  }
}

export default InsertColumnButton;
