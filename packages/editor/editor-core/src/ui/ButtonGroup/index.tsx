import * as React from 'react';
import { HTMLAttributes, ComponentClass, PureComponent } from 'react';
import styled from 'styled-components';
import ToolbarButton, { Props as ToolbarButtonProps } from '../ToolbarButton';

const Wrapper: ComponentClass<
  HTMLAttributes<{}> & { width?: 'small' | 'large' }
> = styled.span`
  display: inline-flex;
  align-items: center;

  & > div {
    display: flex;
  }
`;

export interface Props {
  width?: 'small' | 'large';
  focused?: boolean;
}

export interface State {
  selectedItemIdx: number;
}

export default class ButtonGroup extends PureComponent<Props, State> {
  state = {
    selectedItemIdx: 0,
  };

  private handleKeyDown = (e: React.KeyboardEvent<{}>): boolean => {
    const childCount = React.Children.toArray(this.props.children).filter(
      child => child instanceof ToolbarButton,
    ).length;
    if (!childCount) {
      return false;
    }

    const { selectedItemIdx } = this.state;

    if (e.key === 'ArrowLeft') {
      this.setState({ selectedItemIdx: Math.max(selectedItemIdx - 1, 0) });
    } else if (e.key === 'ArrowRight') {
      this.setState({
        selectedItemIdx: Math.min(selectedItemIdx + 1, childCount - 1),
      });
    }

    e.preventDefault();

    if (
      (e.key === 'ArrowLeft' && selectedItemIdx <= 0) ||
      (e.key === 'ArrowRight' && selectedItemIdx >= childCount - 1)
    ) {
      return true;
    } else {
      e.stopPropagation();
      return false;
    }
  };

  render() {
    const { width, children } = this.props;
    console.log(
      'button group has children:',
      this.props.children,
      'selected',
      this.state.selectedItemIdx,
      'group focused',
      this.props.focused,
    );

    return (
      <Wrapper onKeyDown={this.handleKeyDown} width={width}>
        {React.Children.map(children, (child, idx) => {
          if (child instanceof ToolbarButton) {
            return React.cloneElement(
              child as React.ReactElement<any>,
              {
                focused:
                  this.props.focused && this.state.selectedItemIdx === idx,
              } as ToolbarButtonProps,
            );
          } else {
            return child;
          }
        })}
      </Wrapper>
    );
  }
}
