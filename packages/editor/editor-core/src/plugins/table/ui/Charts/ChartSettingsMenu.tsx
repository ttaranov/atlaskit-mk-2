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
}

export interface DialogProps {
  onRef?: (ref: HTMLDivElement | null) => void;
}

export interface State {
  isOpen?: boolean;
}

export class ChartSettingsDialog extends Component<DialogProps> {
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
        <h5>Start date</h5>
        <Select
          defaultValue={{ label: 'Atlassian', value: 'atlassian' }}
          options={[
            { label: 'Atlassian', value: 'atlassian' },
            { label: 'Sean Curtis', value: 'scurtis' },
            { label: 'Mike Gardiner', value: 'mg' },
            { label: 'Charles Lee', value: 'clee' },
          ]}
        />
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
            <ChartSettingsDialog onRef={ref => (this.dialogRef = ref)} />
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
