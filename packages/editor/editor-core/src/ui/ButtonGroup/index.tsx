import * as React from 'react';
import { HTMLAttributes, ComponentClass, PureComponent } from 'react';
import styled from 'styled-components';
import ToolbarButton, { Props as ToolbarButtonProps } from '../ToolbarButton';
import ToolbarTextFormatting from 'src/plugins/text-formatting/ui/ToolbarTextFormatting';
// import ToolbarAdvancedTextFormatting from 'src/plugins/text-formatting/ui/ToolbarAdvancedTextFormatting';

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
  focused?: 0 | 1 | 2;
}

export interface State {
  selectedItemIdx: number | undefined;
  focused?: 0 | 1 | 2;
}

export default class ButtonGroup extends PureComponent<Props, State> {
  state = {
    selectedItemIdx: 0, // Need to fic this - assuming navigation always starts from
    focused: this.props.focused,
  };

  private isValidChild = (child: React.ReactChild) => {
    //@ts-ignore
    return child.type.name != 'StyledComponent';
  };

  private handleKeyDown = (e: React.KeyboardEvent<{}>): boolean => {
    const childCount = React.Children.toArray(this.props.children).filter(
      this.isValidChild,
    ).length;
    if (!childCount) {
      return false;
    }

    const { selectedItemIdx } = this.state;
    const { focused } = this.state;
    const defaultIdx =
      focused === 1 ? 0 : focused === 2 ? childCount - 1 : -999; // Maybe change this?

    if (e.key === 'ArrowRight') {
      console.log('ArrowRight in ButtonGroup!');
      if (
        typeof selectedItemIdx !== 'undefined' &&
        selectedItemIdx >= childCount - 1
      ) {
        // we've hit the end
        this.setState({ selectedItemIdx: undefined });
        return true;
      }

      const newSelectedItemIdx =
        typeof selectedItemIdx === 'undefined'
          ? defaultIdx
          : selectedItemIdx + 1;
      this.setState({
        selectedItemIdx: newSelectedItemIdx,
        focused: focused == 1 ? 2 : focused,
      });
      e.preventDefault();
      e.stopPropagation();
      return false;
    } else if (e.key === 'ArrowLeft') {
      console.log('ArrowLeft in ButtonGroup!');
      if (typeof selectedItemIdx !== 'undefined' && selectedItemIdx <= 0) {
        // we've hit the end
        this.setState({ selectedItemIdx: undefined });
        return true;
      }
      const newSelectedItemIdx =
        typeof selectedItemIdx === 'undefined'
          ? defaultIdx
          : selectedItemIdx - 1;

      this.setState({
        selectedItemIdx: newSelectedItemIdx,
        focused: focused === 2 ? 1 : focused,
      });
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    return true;
  };

  render() {
    const { width, children } = this.props;
    const { selectedItemIdx, focused } = this.state;
    const childCount = React.Children.toArray(this.props.children).filter(
      this.isValidChild,
    ).length;

    const defaultIdx =
      focused === 2 ? 0 : focused === 1 ? childCount - 1 : -999; // Maybe change this?

    // If index is undefined and we focus this object, the keyboard method won't fire - this is a bad fix
    const newSelectedItemIdx =
      typeof selectedItemIdx === 'undefined' ? defaultIdx : selectedItemIdx;

    console.log(
      `BUTTON GROUP / (${
        React.Children.toArray(this.props.children).length
      } children) children:`,
      this.props.children,
      'selectedIndex:',
      selectedItemIdx,
      'focused:',
      focused,
      'newSelectedItemIdx:',
      newSelectedItemIdx,
    );

    let validChildCount = -1;
    return (
      <Wrapper onKeyDown={this.handleKeyDown} width={width}>
        {React.Children.map(children, (child, idx) => {
          if (this.isValidChild(child)) {
            validChildCount += 1;
            if (
              newSelectedItemIdx === validChildCount ? this.props.focused : 0
            ) {
              console.log(
                `Focusing child from buttonGroup ${childCount}:`,
                child,
              );
            }
            return React.cloneElement(
              child as React.ReactElement<any>,
              {
                focused:
                  newSelectedItemIdx === validChildCount
                    ? this.props.focused
                    : 0, //idx,
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
