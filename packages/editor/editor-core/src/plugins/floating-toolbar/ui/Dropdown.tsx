import * as React from 'react';
import { Component, ReactElement } from 'react';
import styled from 'styled-components';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';

import UiDropdown from '../../../ui/Dropdown';
import withOuterListeners from '../../../ui/with-outer-listeners';
import Button from './Button';
import DropdownMenu from './DropdownMenu';

const DropdownWithOutsideListeners = withOuterListeners(UiDropdown);

export interface RenderOptionsPropsT<T> {
  hide: () => void;
  dispatchCommand: (command: T) => void;
}

export interface DropdownOptionT<T> {
  title: string;
  onClick: T;
  selected?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export type DropdownOptions<T> =
  | Array<DropdownOptionT<T>>
  | ((props: RenderOptionsPropsT<T>) => React.ReactElement<any> | null);

const DropdownExpandContainer = styled.span`
  margin-left: -8px;
`;

const IconGroup = styled.div`
  display: flex;
`;

const CompositeIcon = ({ icon }) => (
  <IconGroup>
    {icon}
    <DropdownExpandContainer>
      <ExpandIcon label="Expand dropdown menu" />
    </DropdownExpandContainer>
  </IconGroup>
);

export interface Props {
  title: string;
  icon: ReactElement<any>;
  hideExpandIcon?: boolean;
  options: DropdownOptions<Function>;
  dispatchCommand: (command: Function) => void;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
}

export interface State {
  isOpen: boolean;
}

export default class Dropdown extends Component<Props, State> {
  state: State = { isOpen: false };

  render() {
    const { isOpen } = this.state;
    const {
      title,
      icon,
      options,
      dispatchCommand,
      mountPoint,
      boundariesElement,
      scrollableElement,
      hideExpandIcon,
    } = this.props;

    const TriggerIcon = hideExpandIcon ? icon : <CompositeIcon icon={icon} />;

    return (
      <DropdownWithOutsideListeners
        mountTo={mountPoint}
        boundariesElement={boundariesElement}
        scrollableElement={scrollableElement}
        isOpen={isOpen}
        handleClickOutside={this.hide}
        handleEscapeKeydown={this.hide}
        trigger={
          <Button
            title={title}
            icon={TriggerIcon}
            onClick={this.toggleOpen}
            selected={isOpen}
          />
        }
      >
        <div>
          {Array.isArray(options)
            ? this.renderArrayOptions(options)
            : options({ hide: this.hide, dispatchCommand })}
        </div>
      </DropdownWithOutsideListeners>
    );
  }

  private renderArrayOptions = (options: Array<DropdownOptionT<Function>>) => {
    return (
      <DropdownMenu
        hide={this.hide}
        dispatchCommand={this.props.dispatchCommand}
        items={options}
      />
    );
  };

  private toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  private hide = () => {
    this.setState({ isOpen: false });
  };
}
