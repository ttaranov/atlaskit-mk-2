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
  clearFormatting,
  tooltip,
} from '../../../../keymaps';
import ToolbarButton from '../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../ui/DropdownMenu';
import { TriggerWrapper, Wrapper, Separator } from '../../../../ui/styles';

export interface Props {
  isDisabled?: boolean;
  editorView: EditorView;
  pluginStateTextFormatting?: TextFormattingState | undefined;
  pluginStateClearFormatting?: ClearFormattingState | undefined;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  isReducedSpacing?: boolean;
}

export interface State {
  isOpen?: boolean;
  underlineActive?: boolean;
  underlineDisabled?: boolean;
  underlineHidden?: boolean;
  codeActive?: boolean;
  codeDisabled?: boolean;
  codeHidden?: boolean;
  strikethroughActive?: boolean;
  strikethroughDisabled?: boolean;
  strikeHidden?: boolean;
  subscriptActive?: boolean;
  subscriptDisabled?: boolean;
  subscriptHidden?: boolean;
  superscriptActive?: boolean;
  superscriptDisabled?: boolean;
  superscriptHidden?: boolean;
  clearFormattingDisabled?: boolean;
}

export default class ToolbarAdvancedTextFormatting extends PureComponent<
  Props,
  State
> {
  state: State = {
    isOpen: false,
  };

  componentDidMount() {
    const {
      pluginStateTextFormatting,
      pluginStateClearFormatting,
    } = this.props;
    if (pluginStateTextFormatting) {
      pluginStateTextFormatting.subscribe(
        this.handlePluginStateTextFormattingChange,
      );
    }
    if (pluginStateClearFormatting) {
      pluginStateClearFormatting.subscribe(
        this.handlePluginStateClearFormattingChange,
      );
    }
  }

  componentWillUnmount() {
    const {
      pluginStateTextFormatting,
      pluginStateClearFormatting,
    } = this.props;
    if (pluginStateTextFormatting) {
      pluginStateTextFormatting.unsubscribe(
        this.handlePluginStateTextFormattingChange,
      );
    }
    if (pluginStateClearFormatting) {
      pluginStateClearFormatting.unsubscribe(
        this.handlePluginStateClearFormattingChange,
      );
    }
  }

  private onOpenChange = (attrs: any) => {
    this.setState({
      isOpen: attrs.isOpen,
    });
  };

  private handleTriggerClick = () => {
    this.onOpenChange({ isOpen: !this.state.isOpen });
  };

  render() {
    const {
      isOpen,
      codeActive,
      underlineActive,
      strikethroughActive,
      subscriptActive,
      superscriptActive,
      codeDisabled,
      underlineDisabled,
      strikethroughDisabled,
      clearFormattingDisabled,
      subscriptDisabled,
      superscriptDisabled,
    } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isReducedSpacing,
    } = this.props;
    const items = this.createItems();
    const toolbarButtonFactory = (disabled: boolean) => (
      <ToolbarButton
        spacing={isReducedSpacing ? 'none' : 'default'}
        selected={
          isOpen ||
          underlineActive ||
          codeActive ||
          strikethroughActive ||
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
        strikethroughDisabled &&
        clearFormattingDisabled &&
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
      pluginStateTextFormatting,
      pluginStateClearFormatting,
    } = this.props;
    let items: any[] = [];

    if (pluginStateTextFormatting) {
      const {
        underlineHidden,
        codeHidden,
        strikeHidden,
        subscriptHidden,
        superscriptHidden,
      } = this.state;
      if (!underlineHidden) {
        this.addRecordToItems(
          items,
          'Underline',
          'underline',
          tooltip(toggleUnderline, true),
        );
      }
      if (!strikeHidden) {
        this.addRecordToItems(
          items,
          'Strikethrough',
          'strike',
          tooltip(toggleStrikethrough, true),
        );
      }
      if (!codeHidden) {
        this.addRecordToItems(items, 'Code', 'code', tooltip(toggleCode, true));
      }
      if (!subscriptHidden) {
        this.addRecordToItems(items, 'Subscript', 'subscript');
      }
      if (!superscriptHidden) {
        this.addRecordToItems(items, 'Superscript', 'superscript');
      }
    }
    if (pluginStateClearFormatting) {
      this.addRecordToItems(
        items,
        'Clear Formatting',
        'clearFormatting',
        tooltip(clearFormatting, true),
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

  private handlePluginStateTextFormattingChange = (
    pluginState: TextFormattingState,
  ) => {
    this.setState({
      underlineActive: pluginState.underlineActive,
      underlineDisabled: pluginState.underlineDisabled,
      underlineHidden: pluginState.underlineHidden,

      codeActive: pluginState.codeActive,
      codeDisabled: pluginState.codeDisabled,
      codeHidden: pluginState.codeHidden,

      strikethroughActive: pluginState.strikeActive,
      strikethroughDisabled: pluginState.strikeDisabled,
      strikeHidden: pluginState.strikeHidden,

      subscriptActive: pluginState.subscriptActive,
      subscriptDisabled: pluginState.subscriptDisabled,
      subscriptHidden: pluginState.subscriptHidden,

      superscriptActive: pluginState.superscriptActive,
      superscriptDisabled: pluginState.superscriptDisabled,
      superscriptHidden: pluginState.superscriptHidden,
    });
  };

  private handlePluginStateClearFormattingChange = (
    pluginState: ClearFormattingState,
  ) => {
    this.setState({
      clearFormattingDisabled: !pluginState.formattingIsPresent,
    });
  };

  private onItemActivated = ({ item }) => {
    analyticsService.trackEvent(`atlassian.editor.format.${item.value}.button`);
    const {
      pluginStateTextFormatting,
      pluginStateClearFormatting,
    } = this.props;
    switch (item.value) {
      case 'underline':
        pluginStateTextFormatting!.toggleUnderline(this.props.editorView);
        break;
      case 'code':
        pluginStateTextFormatting!.toggleCode(this.props.editorView);
        break;
      case 'strike':
        pluginStateTextFormatting!.toggleStrike(this.props.editorView);
        break;
      case 'subscript':
        pluginStateTextFormatting!.toggleSubscript(this.props.editorView);
        break;
      case 'superscript':
        pluginStateTextFormatting!.toggleSuperscript(this.props.editorView);
        break;
      case 'clearFormatting':
        pluginStateClearFormatting!.clearFormatting(this.props.editorView);
        break;
    }
    this.setState({ isOpen: false });
  };
}
