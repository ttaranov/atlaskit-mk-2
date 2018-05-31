import * as React from 'react';
import styled from 'styled-components';
import { Component } from 'react';

import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';

import { Popup } from '@atlaskit/editor-common';
import SettingsIcon from '@atlaskit/icon/glyph/settings';

import {
  TriggerWrapper,
  ExpandIconWrapper,
  ToolbarButtonWide,
} from '../TableFloatingToolbar/styles';

import InlineDialog from '@atlaskit/inline-dialog';
import { dropShadow } from '../../../../ui/styles';

// import Form, { Field, FormHeader, FormSection, FormFooter } from '@atlaskit/form';
import Select from '@atlaskit/select';
import { ChartSettings, ChartSetting } from '../../graphs';
import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { containsHeaderRow } from '../../utils';

export const Toolbar: React.ComponentClass<
  React.HTMLAttributes<{}>
> = styled.div`
  margin-top: -8px;
  background-color: white;
  border-radius: 3px;
  ${dropShadow} padding: 4px;
  display: flex;
`;

export interface Props {
  target?: HTMLElement;
  onPopup?: (isOpen: boolean) => void;
  availableChartSettings: ChartSettings;
  tableNode: Node;
  state: EditorState;
  currentSettings: object;
  onChange: (key: string, value: any) => void;
}

export interface DialogProps {
  onRef?: (ref: HTMLDivElement | null) => void;
  availableChartSettings: ChartSettings;
  columns: string[];
  currentSettings: object;
  onChange: (key: string, value: any) => void;
}

export interface State {
  isOpen?: boolean;
}

export class ChartSettingsDialog extends Component<DialogProps> {
  renderSetting(setting: ChartSetting) {
    if (setting.input === 'column-select') {
      return (
        <Select
          isSearchable={false}
          options={this.props.columns.map((colname, idx) => {
            return { label: colname, value: idx };
          })}
          value={{
            label: this.props.columns[this.props.currentSettings[setting.name]],
            value: this.props.currentSettings[setting.name],
          }}
          onChange={e => {
            this.props.onChange(setting.name, e.value);
          }}
        />
      );
    } else if (setting.input === 'checkbox') {
      return (
        <input
          type="checkbox"
          checked={this.props.currentSettings[setting.name]}
          onChange={e => this.props.onChange(setting.name, e.target.checked)}
        />
      );
    }

    console.warn('cannot render setting', setting);
    return null;
  }

  render() {
    return (
      <div
        ref={ref => {
          this.props.onRef ? this.props.onRef(ref) : null;
        }}
        style={{
          width: '200px',
          maxHeight: '200px',
        }}
      >
        {this.props.availableChartSettings.map(availableSetting => {
          return (
            <div>
              <h5>{availableSetting.title}</h5>
              {this.renderSetting(availableSetting)}
            </div>
          );
        })}
      </div>
    );
  }
}

export default class ChartSettingsMenu extends Component<Props, State> {
  private dialogRef: HTMLDivElement | null = null;

  state: State = {
    isOpen: false,
  };

  handleClick = () => {
    this.props.onPopup ? this.props.onPopup(!this.state.isOpen) : null;

    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  handleOnClose = (data: { isOpen: boolean; event: Event }) => {
    // try to find if the event target was connected to DOM
    // react-select removes it after selection
    let parent = (event!.target! as any).parentNode;
    let wasConnected = false;
    while (parent) {
      parent = parent.parentNode;

      if (parent === document.body) {
        wasConnected = true;
        break;
      }
    }

    // check if it used to be part of dialog, otherwise don't actually close
    if (
      (this.dialogRef &&
        event &&
        this.dialogRef.contains(event!.srcElement!)) ||
      !wasConnected
    ) {
      return;
    }

    this.setState({
      isOpen: data.isOpen,
    });

    this.props.onPopup ? this.props.onPopup(data.isOpen) : null;
  };

  render() {
    // FIXME: move out to parent component, and just pass in string array instead
    const haveHeaderRow = containsHeaderRow(
      this.props.state,
      this.props.tableNode,
    );

    const columnNames: string[] = [];
    if (haveHeaderRow) {
      this.props.tableNode.firstChild!.forEach((col, _, colIdx) => {
        columnNames.push(col.textContent);
      });
    } else {
      for (let i = 0; i < this.props.tableNode.firstChild!.childCount; i++) {
        columnNames.push(`Column ${i}`);
      }
    }

    return (
      <Popup
        target={this.props.target}
        alignX="right"
        offset={[25, -50]}
        alignY="top"
        // mountTo={popupsMountPoint}
        // boundariesElement={popupsBoundariesElement}
        // scrollableElement={popupsScrollableElement}
      >
        <InlineDialog
          content={
            <ChartSettingsDialog
              columns={columnNames}
              availableChartSettings={this.props.availableChartSettings}
              currentSettings={this.props.currentSettings}
              onRef={ref => (this.dialogRef = ref)}
              onChange={this.props.onChange}
            />
          }
          position="bottom right"
          shouldFlip="left"
          isOpen={this.state.isOpen}
          onClose={this.handleOnClose}
        >
          <Toolbar>
            <ToolbarButtonWide
              spacing="compact"
              onClick={this.handleClick}
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
      </Popup>
    );
  }
}
