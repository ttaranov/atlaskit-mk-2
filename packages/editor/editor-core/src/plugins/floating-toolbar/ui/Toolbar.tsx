import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import { ButtonGroup } from '@atlaskit/button';
import { borderRadius, gridSize } from '@atlaskit/theme';

import { FloatingToolbarItem } from '../types';
import { compareArrays } from '../utils';

import Button from './Button';
import Dropdown from './Dropdown';
import Separator from './Separator';

const akGridSize = gridSize();

const ToolbarContainer = styled.div`
  background-color: white;
  border-radius: ${borderRadius()}px;
  box-shadow: 0 0 1px rgba(9, 30, 66, 0.31),
    0 4px 8px -2px rgba(9, 30, 66, 0.25);
  padding: ${akGridSize / 2}px ${akGridSize}px;
  display: flex;
  line-height: 1;
  box-sizing: border-box;
`;

export interface Props {
  items: Array<FloatingToolbarItem<Function>>;
  dispatchCommand: (command?: Function) => void;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
}

export default class Toolbar extends Component<Props> {
  render() {
    const {
      items,
      dispatchCommand,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
    } = this.props;
    if (!items.length) {
      return null;
    }

    return (
      <ToolbarContainer aria-label="Floating Toolbar">
        <ButtonGroup>
          {items.filter(item => !item.hidden).map((item, idx) => {
            switch (item.type) {
              case 'button':
                const ButtonIcon = item.icon;
                return (
                  <Button
                    key={idx}
                    title={item.title}
                    icon={<ButtonIcon label={item.title} />}
                    appearance={item.appearance}
                    onClick={() => dispatchCommand(item.onClick)}
                    onMouseEnter={() => dispatchCommand(item.onMouseEnter)}
                    onMouseLeave={() => dispatchCommand(item.onMouseLeave)}
                    selected={item.selected}
                    disabled={item.disabled}
                  />
                );

              case 'dropdown':
                const DropdownIcon = item.icon;
                return (
                  <Dropdown
                    key={idx}
                    title={item.title}
                    icon={<DropdownIcon label={item.title} />}
                    dispatchCommand={dispatchCommand}
                    options={item.options}
                    hideExpandIcon={item.hideExpandIcon}
                    mountPoint={popupsMountPoint}
                    boundariesElement={popupsBoundariesElement}
                    scrollableElement={popupsScrollableElement}
                  />
                );

              case 'separator':
                return <Separator key={idx} />;
            }
          })}
        </ButtonGroup>
      </ToolbarContainer>
    );
  }

  shouldComponentUpdate(nextProps: Props) {
    return !compareArrays(this.props.items, nextProps.items);
  }
}
