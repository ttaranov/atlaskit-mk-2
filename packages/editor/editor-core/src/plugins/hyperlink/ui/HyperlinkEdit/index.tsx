import * as React from 'react';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';

import OpenIcon from '@atlaskit/icon/glyph/editor/open';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-common';
import PanelTextInput from '../../../../ui/PanelTextInput';
import { getNearestNonTextNode } from '../../../../ui/FloatingToolbar';
import { FloatingToolbar, Separator, ToolbarButton } from '../styles';

export const messages = defineMessages({
  openLink: {
    id: 'fabric.editor.openLink',
    defaultMessage: 'Open link',
    description: 'Follows the hyperlink.',
  },
  unlink: {
    id: 'fabric.editor.unlink',
    defaultMessage: 'Unlink',
    description: 'Removes the hyperlink but keeps your text.',
  },
});

export interface Props {
  onBlur?: (text: string) => void;
  onSubmit?: (text: string) => void;
  onUnlink?: () => void;
  onOpenLink?: () => void;

  target: Node;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;

  autoFocus?: boolean;
  defaultValue?: string;
  // Enforces that clicking "Open Link" will use the provided href.
  // Defaults to the text-input content when not given
  alwaysOpenLinkAt?: string;
  placeholder: string;
}

export interface State {
  text: string;
}

class HyperlinkEdit extends React.Component<Props & InjectedIntlProps, State> {
  constructor(props) {
    super(props);
    this.state = { text: props.defaultValue || '' };
  }

  handleChange = (text: string) => {
    this.setState({ text });
  };

  handleBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur(this.state.text);
    }
  };

  handleSubmit = () => {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.text);
    }
  };

  render() {
    const {
      target,
      popupsMountPoint,
      popupsBoundariesElement,
      placeholder,
      onUnlink,
      autoFocus,
      onOpenLink,
      defaultValue,
      alwaysOpenLinkAt,
      intl: { formatMessage },
    } = this.props;

    const labelOpenLink = formatMessage(messages.openLink);
    const labelUnlink = formatMessage(messages.unlink);
    return (
      <FloatingToolbar
        target={getNearestNonTextNode(target)!}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        fitWidth={400}
        fitHeight={32}
        offset={[0, 12]}
        className="normal"
        zIndex={akEditorFloatingDialogZIndex}
      >
        <PanelTextInput
          autoFocus={autoFocus}
          defaultValue={defaultValue || ''}
          placeholder={placeholder}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onCancel={this.handleBlur}
        />
        {(onOpenLink || onUnlink) && <Separator />}
        {onOpenLink && (
          <ToolbarButton
            spacing="compact"
            href={alwaysOpenLinkAt || this.state.text}
            onClick={onOpenLink}
            target="_blank"
            title={labelOpenLink}
            iconBefore={<OpenIcon label={labelOpenLink} />}
          />
        )}
        {onUnlink && (
          <ToolbarButton
            spacing="compact"
            onClick={onUnlink}
            title={labelUnlink}
            iconBefore={<UnlinkIcon label={labelUnlink} />}
          />
        )}
      </FloatingToolbar>
    );
  }
}

export default injectIntl(HyperlinkEdit);
