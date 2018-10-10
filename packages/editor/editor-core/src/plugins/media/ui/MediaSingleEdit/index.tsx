import * as React from 'react';
import styled from 'styled-components';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';

import WrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import WrapRightIcon from '@atlaskit/icon/glyph/editor/media-wrap-right';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { MediaSingleLayout } from '@atlaskit/editor-common';
import { colors } from '@atlaskit/theme';

import commonMessages from '../../../../messages';
import UiToolbarButton from '../../../../ui/ToolbarButton';
import UiSeparator from '../../../../ui/Separator';
import UiFloatingToolbar from '../../../../ui/FloatingToolbar';
import { closestElement } from '../../../../utils';
import { MediaPluginState } from '../../pm-plugins/main';

export const messages = defineMessages({
  wrapLeft: {
    id: 'fabric.editor.wrapLeft',
    defaultMessage: 'Wrap left',
    description: 'Aligns your image to the left and wraps text around it.',
  },
  wrapRight: {
    id: 'fabric.editor.wrapRight',
    defaultMessage: 'Wrap right',
    description: 'Aligns your image to the right and wraps text around it.',
  },
});

export interface Props {
  target?: HTMLElement;
  layout?: MediaSingleLayout;
  allowBreakout: boolean;
  allowLayout: boolean;
  pluginState: MediaPluginState;
}

const icons = {
  'wrap-left': WrapLeftIcon,
  center: CenterIcon,
  'wrap-right': WrapRightIcon,
  wide: WideIcon,
  'full-width': FullWidthIcon,
};

const layoutToMessages = {
  'wrap-left': messages.wrapLeft,
  center: commonMessages.layoutFixedWidth,
  'wrap-right': messages.wrapRight,
  wide: commonMessages.layoutWide,
  'full-width': commonMessages.layoutFullWidth,
};

const ToolbarButton = styled(UiToolbarButton)`
  width: 24px;
  padding: 0;
  margin: 0 2px;
`;

const Separator = styled(UiSeparator)`
  margin: 2px 6px;
`;

// `line-height: 1` to fix extra 1px height from toolbar wrapper
const FloatingToolbar = styled(UiFloatingToolbar)`
  & > div {
    line-height: 1;
  }
  & > div:first-child > button {
    margin-left: 0;
  }
  & > div:last-child > button {
    margin-right: 0;
  }
`;

const ToolbarButtonDestructive = styled(ToolbarButton)`
  &:hover {
    color: ${colors.R300} !important;
  }
  &:active {
    color: ${colors.R400} !important;
  }
  &[disabled]:hover {
    color: ${colors.N70} !important;
  }
`;

class MediaSingleEdit extends React.Component<Props & InjectedIntlProps, {}> {
  render() {
    const { formatMessage } = this.props.intl;
    const {
      target,
      layout: selectedLayout,
      allowBreakout,
      allowLayout,
    } = this.props;
    if (
      target &&
      !closestElement(target, 'li') &&
      !closestElement(target, 'table')
    ) {
      const labelRemove = formatMessage(commonMessages.remove);
      return (
        <FloatingToolbar
          target={target}
          offset={[0, 12]}
          fitHeight={32}
          alignX="center"
        >
          {Object.keys(icons).map((layout, index) => {
            // Don't render Wide and Full width button for image smaller than editor content width
            if (index > 2 && !allowBreakout) {
              return;
            }
            const Icon = icons[layout];
            const label = formatMessage(layoutToMessages[layout]);
            return (
              <ToolbarButton
                spacing="compact"
                key={index}
                disabled={!allowLayout}
                selected={layout === selectedLayout}
                onClick={this.handleChangeLayout.bind(this, layout)}
                title={label}
                iconBefore={<Icon label={label} />}
              />
            );
          })}
          <Separator />
          <ToolbarButtonDestructive
            spacing="compact"
            onClick={this.handleRemove}
            title={labelRemove}
            iconBefore={<RemoveIcon label={labelRemove} />}
          />
        </FloatingToolbar>
      );
    } else {
      return null;
    }
  }

  private handleRemove = () => {
    const { pluginState } = this.props;
    pluginState.removeSelectedMediaNode();
  };

  private handleChangeLayout(layout: MediaSingleLayout) {
    this.props.pluginState.align(layout);
  }
}

export default injectIntl(MediaSingleEdit);
