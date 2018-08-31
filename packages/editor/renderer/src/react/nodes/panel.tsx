import * as React from 'react';
import { PureComponent } from 'react';
import {
  akColorG50,
  akColorG400,
  akColorP50,
  akColorP400,
  akColorB400,
  akColorY50,
  akColorB50,
  akColorY400,
  akColorR50,
  akColorR400,
} from '@atlaskit/util-shared-styles';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { PanelType } from '@atlaskit/editor-common';

export interface Props {
  panelType: PanelType;
}

const config = {
  info: {
    icon: InfoIcon,
    background: akColorB50,
    iconColor: akColorB400,
  },
  note: {
    icon: NoteIcon,
    background: akColorP50,
    iconColor: akColorP400,
  },
  tip: {
    icon: TipIcon,
    background: akColorG50,
    iconColor: akColorG400,
  },
  success: {
    icon: SuccessIcon,
    background: akColorG50,
    iconColor: akColorG400,
  },
  warning: {
    icon: WarningIcon,
    background: akColorY50,
    iconColor: akColorY400,
  },
  error: {
    icon: ErrorIcon,
    background: akColorR50,
    iconColor: akColorR400,
  },
};

export default class Panel extends PureComponent<Props, {}> {
  render() {
    const { panelType, children } = this.props;
    return (
      <div
        style={{ background: config[panelType].background }}
        className="ak-editor-panel"
      >
        <span
          style={{ color: config[panelType].iconColor }}
          className="ak-editor-panel__icon"
        >
          {this.getIcon()}
        </span>
        <div className="ak-editor-panel__content">{children}</div>
      </div>
    );
  }

  getIcon() {
    const { panelType } = this.props;
    // tslint:disable-next-line:variable-name
    const Icon = config[panelType].icon;
    return <Icon label={`Panel {panelType}`} />;
  }
}
