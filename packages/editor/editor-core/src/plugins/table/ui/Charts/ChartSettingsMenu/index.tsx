import * as React from 'react';
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
import { HTMLAttributes, ComponentClass, ButtonHTMLAttributes } from 'react';

import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import { Popup } from '@atlaskit/editor-common';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import InlineDialog from '@atlaskit/inline-dialog';

import UiToolbarButton, {
  Props as ToolbarButtonProps,
} from '../../../../../ui/ToolbarButton';

export const TriggerWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
`;

export const ExpandIconWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.span`
  margin-left: -8px;
`;

export const ToolbarButton: StyledComponentClass<
  ToolbarButtonProps,
  ButtonHTMLAttributes<{}>
> = styled(UiToolbarButton)`
  width: 24px;
  padding: 0;
  margin: 0 2px;
`;

export const ToolbarButtonWide = styled(ToolbarButton)`
  width: 40px;
`;

import { dropShadow } from '../../../../../ui/styles';
import { ChartSettings } from '../../../graphs';
import { ChartSettingsDialog } from './ChartSettingsDialog';
import withOuterListeners from '../../../../../ui/with-outer-listeners';

export const Toolbar: any = styled.div`
  margin-top: -8px;
  background-color: white;
  border-radius: 3px;
  ${dropShadow} padding: 4px;
  display: flex;
`;

const PopupWithOutsizeListeners: any = withOuterListeners(Popup);

export interface Props {
  target?: HTMLElement;
  onPopup?: (isOpen: boolean) => void;
  availableChartSettings: ChartSettings;
  tableNode: Node;
  state: EditorState;
  currentSettings: object;
  onChange: (key: string, value: any) => void;
  columnNames: string[];
}

export interface State {
  isOpen?: boolean;
}

export default class ChartSettingsMenu extends React.Component<Props, State> {
  private dialogRef: HTMLDivElement | null = null;

  state: State = {
    isOpen: false,
  };

  render() {
    return (
      <PopupWithOutsizeListeners
        target={this.props.target}
        alignX="right"
        offset={[25, -50]}
        alignY="top"
        handleClickOutside={this.handleClickOutside}
      >
        <InlineDialog
          content={
            <ChartSettingsDialog
              columns={this.props.columnNames}
              availableChartSettings={this.props.availableChartSettings}
              currentSettings={this.props.currentSettings}
              onChange={this.props.onChange}
            />
          }
          position="bottom right"
          shouldFlip="left"
          isOpen={this.state.isOpen}
        >
          <Toolbar
            innerRef={ref => {
              this.dialogRef = ref;
            }}
          >
            <ToolbarButtonWide
              spacing="compact"
              onClick={this.togglePopup}
              title="Chart settings"
              iconBefore={
                <TriggerWrapper>
                  <SettingsIcon label="Chart settings" />
                  <ExpandIconWrapper>
                    <ExpandIcon label="expand-dropdown-menu" />
                  </ExpandIconWrapper>
                </TriggerWrapper>
              }
            />
          </Toolbar>
        </InlineDialog>
      </PopupWithOutsizeListeners>
    );
  }

  private togglePopup = () => {
    this.props.onPopup ? this.props.onPopup(!this.state.isOpen) : null;

    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  private handleClickOutside = event => {
    if (
      this.dialogRef &&
      document.contains(event.target) &&
      !this.dialogRef.contains(event.target) &&
      this.state.isOpen
    ) {
      this.togglePopup();
    }
  };
}
