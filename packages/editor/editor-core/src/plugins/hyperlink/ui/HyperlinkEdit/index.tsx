import * as React from 'react';
import OpenIcon from '@atlaskit/icon/glyph/editor/open';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-common';
import PanelTextInput from '../../../../ui/PanelTextInput';
import { getNearestNonTextNode } from '../../../../ui/FloatingToolbar';
import { FloatingToolbar, Separator, ToolbarButton } from '../styles';

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

export default class HyperlinkEdit extends React.Component<Props, State> {
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
    } = this.props;
    return (
      <FloatingToolbar
        alignX="left"
        target={getNearestNonTextNode(target)!}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
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
            intlTitle="link_open"
            iconBefore={<OpenIcon label="Open link" />}
          />
        )}
        {onUnlink && (
          <ToolbarButton
            spacing="compact"
            onClick={onUnlink}
            intlTitle="link_unlink"
            iconBefore={<UnlinkIcon label="Unlink" />}
          />
        )}
      </FloatingToolbar>
    );
  }
}
