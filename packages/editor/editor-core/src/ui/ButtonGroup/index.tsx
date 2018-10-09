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
}

export default class ButtonGroup extends PureComponent<Props, State> {
  state = {
    selectedItemIdx: 0, // TODO
  };

  private isValidChild = (child: React.ReactChild) => {
    // const result: boolean = true //(child instanceof ToolbarButton) || (child instanceof ButtonGroup) || (child instanceof ToolbarTextFormatting) //|| (child instanceof ToolbarAdvancedTextFormatting);
    //@ts-ignore
    const result: boolean = child.type.name != 'StyledComponent';

    if (!result) {
      console.log('Child is not valid, it is:', child);
    }
    return result;
  };

  private handleKeyDown = (e: React.KeyboardEvent<{}>): boolean => {
    const childCount = React.Children.toArray(this.props.children).filter(
      this.isValidChild,
    ).length;
    if (!childCount) {
      return false;
    }

    const { selectedItemIdx } = this.state;
    const { focused } = this.props;
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
      this.setState({ selectedItemIdx: newSelectedItemIdx });
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
      this.setState({ selectedItemIdx: newSelectedItemIdx });
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    return true;
  };

  render() {
    const { width, children, focused } = this.props;
    const { selectedItemIdx } = this.state;
    const childCount = React.Children.toArray(this.props.children).filter(
      this.isValidChild,
    ).length;
    console.log(
      `BUTTON GROUP / (${
        React.Children.toArray(this.props.children).length
      } children) children:`,
      this.props.children,
      'selectedIndex:',
      selectedItemIdx,
      'focused boolean:',
      focused,
    );

    const defaultIdx =
      focused === 2 ? 0 : focused === 1 ? childCount - 1 : -999; // Maybe change this?

    const newSelectedItemIdx =
      typeof selectedItemIdx === 'undefined' ? defaultIdx : selectedItemIdx;

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
