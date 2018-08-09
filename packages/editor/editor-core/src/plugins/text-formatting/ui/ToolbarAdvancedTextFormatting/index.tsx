import * as React from 'react';
import { PureComponent } from 'react';
import MoreIcon from '@atlaskit/icon/glyph/editor/more';
import { EditorView } from 'prosemirror-view';
import { analyticsService } from '../../../../analytics';
import { TextFormattingState } from '../../pm-plugins/main';
import { ClearFormattingState } from '../../pm-plugins/clear-formatting';
import {
  toggleUnderline,
  toggleStrikethrough,
  toggleCode,
  clearFormatting as clearFormattingKeymap,
  tooltip,
} from '../../../../keymaps';
import ToolbarButton from '../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../ui/DropdownMenu';
import { TriggerWrapper, Wrapper, Separator } from '../../../../ui/styles';
import * as commands from '../../commands/text-formatting';
import { clearFormatting } from '../../commands/clear-formatting';

export interface Props {
  isDisabled?: boolean;
  editorView: EditorView;
  textFormattingState?: TextFormattingState;
  clearFormattingState?: ClearFormattingState;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  isReducedSpacing?: boolean;
}

export interface State {
  isOpen?: boolean;
}

export default class ToolbarAdvancedTextFormatting extends PureComponent<
  Props,
  State
> {
  state: State = {
    isOpen: false,
  };

  private onOpenChange = (attrs: any) => {
    this.setState({
      isOpen: attrs.isOpen,
    });
  };

  private handleTriggerClick = () => {
    this.onOpenChange({ isOpen: !this.state.isOpen });
  };

  render() {
    const { isOpen } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isReducedSpacing,
      textFormattingState = {},
      clearFormattingState = {},
    } = this.props;
    const {
      codeActive,
      underlineActive,
      strikeActive,
      subscriptActive,
      superscriptActive,
      codeDisabled,
      underlineDisabled,
      strikeDisabled,
      subscriptDisabled,
      superscriptDisabled,
    } = textFormattingState;
    const { formattingIsPresent } = clearFormattingState;
    const items = this.createItems();
    const toolbarButtonFactory = (disabled: boolean) => (
      <ToolbarButton
        spacing={isReducedSpacing ? 'none' : 'default'}
        selected={
          isOpen ||
          underlineActive ||
          codeActive ||
          strikeActive ||
          subscriptActive ||
          superscriptActive
        }
        disabled={disabled}
        onClick={this.handleTriggerClick}
        iconBefore={
          <TriggerWrapper>
            <MoreIcon label="Open or close advance text formatting dropdown" />
          </TriggerWrapper>
        }
      />
    );

    if (
      !this.props.isDisabled &&
      !(
        strikeDisabled &&
        !formattingIsPresent &&
        codeDisabled &&
        subscriptDisabled &&
        superscriptDisabled &&
        underlineDisabled
      ) &&
      items[0].items.length > 0
    ) {
      return (
        <Wrapper>
          <DropdownMenu
            items={items}
            onItemActivated={this.onItemActivated}
            onOpenChange={this.onOpenChange}
            mountTo={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            scrollableElement={popupsScrollableElement}
            isOpen={isOpen}
            fitHeight={188}
            fitWidth={136}
          >
            {toolbarButtonFactory(false)}
          </DropdownMenu>
          <Separator />
        </Wrapper>
      );
    } else {
      return (
        <Wrapper>
          <div>{toolbarButtonFactory(true)}</div>
          <Separator />
        </Wrapper>
      );
    }
  }

  private createItems = () => {
    const {
      textFormattingState,
      clearFormattingState,
      editorView,
    } = this.props;
    const { code, underline, subsup, strike } = editorView.state.schema.marks;
    let items: any[] = [];

    if (textFormattingState) {
      const {
        underlineHidden,
        codeHidden,
        strikeHidden,
        subscriptHidden,
        superscriptHidden,
      } = textFormattingState;
      if (!underlineHidden && underline) {
        this.addRecordToItems(
          items,
          'Underline',
          'underline',
          tooltip(toggleUnderline, true),
        );
      }
      if (!strikeHidden && strike) {
        this.addRecordToItems(
          items,
          'Strikethrough',
          'strike',
          tooltip(toggleStrikethrough, true),
        );
      }
      if (!codeHidden && code) {
        this.addRecordToItems(items, 'Code', 'code', tooltip(toggleCode, true));
      }
      if (!subscriptHidden && subsup) {
        this.addRecordToItems(items, 'Subscript', 'subscript');
      }
      if (!superscriptHidden && subsup) {
        this.addRecordToItems(items, 'Superscript', 'superscript');
      }
    }
    if (clearFormattingState) {
      this.addRecordToItems(
        items,
        'Clear Formatting',
        'clearFormatting',
        tooltip(clearFormattingKeymap, true),
      );
    }
    return [
      {
        items,
      },
    ];
  };

  private addRecordToItems = (items, content, value, tooltipDescription?) => {
    items.push({
      content,
      value,
      isActive: this.state[`${value}Active`],
      isDisabled: this.state[`${value}Disabled`],
      tooltipDescription,
      tooltipPosition: 'right',
    });
  };

  private onItemActivated = ({ item }) => {
    analyticsService.trackEvent(`atlassian.editor.format.${item.value}.button`);
    const { state, dispatch } = this.props.editorView;
    switch (item.value) {
      case 'underline':
        commands.toggleUnderline()(state, dispatch);
        break;
      case 'code':
        commands.toggleCode()(state, dispatch);
        break;
      case 'strike':
        commands.toggleStrike()(state, dispatch);
        break;
      case 'subscript':
        commands.toggleSubscript()(state, dispatch);
        break;
      case 'superscript':
        commands.toggleSuperscript()(state, dispatch);
        break;
      case 'clearFormatting':
        clearFormatting()(state, dispatch);
        break;
    }
    this.setState({ isOpen: false });
  };
}
