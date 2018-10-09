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
  focused?: boolean;
}

export interface State {
  selectedItemIdx: number;
}

export default class ButtonGroup extends PureComponent<Props, State> {
  state = {
    selectedItemIdx: 0,
  };

  private isValidChild = (child: React.ReactChild) => {
    // const result: boolean = true //(child instanceof ToolbarButton) || (child instanceof ButtonGroup) || (child instanceof ToolbarTextFormatting) //|| (child instanceof ToolbarAdvancedTextFormatting);
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

    if (e.key === 'ArrowRight') {
      if (selectedItemIdx >= childCount - 1) {
        // we've hit the end
        return true;
      }
      const newSelectedItemIdx = selectedItemIdx + 1;
      this.setState({ selectedItemIdx: newSelectedItemIdx });
      e.preventDefault();
      e.stopPropagation();
      return false;
    } else if (e.key === 'ArrowLeft') {
      if (selectedItemIdx <= 0) {
        // we've hit the end
        return true;
      }
      const newSelectedItemIdx = selectedItemIdx - 1;
      this.setState({ selectedItemIdx: newSelectedItemIdx });
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    return true;

    // if (e.key === 'ArrowLeft') {
    //   const newSelectedItemIdx = Math.max(selectedItemIdx - 1, 0)
    //   // console.log(`BUTTONGROUP (${childCount} children): New selected index:`, newSelectedItemIdx)
    //   this.setState({ selectedItemIdx: newSelectedItemIdx});
    // } else if (e.key === 'ArrowRight') {
    //   const newSelectedItemIdx = Math.min(selectedItemIdx + 1, childCount - 1)
    //   // console.log(`BUTTONGROUP (${childCount} children): New selected index:`, newSelectedItemIdx)
    //   this.setState({ selectedItemIdx: newSelectedItemIdx});
    // }

    // e.preventDefault();

    // if (
    //   (e.key === 'ArrowLeft' && selectedItemIdx <= 0) ||
    //   (e.key === 'ArrowRight' && selectedItemIdx >= childCount - 1)
    // ) {
    //   return true;
    // } else {
    //   e.stopPropagation();
    //   return false;
    // }
  };

  render() {
    const { width, children } = this.props;
    const childCount = React.Children.toArray(this.props.children).filter(
      this.isValidChild,
    ).length;
    console.log(
      `BUTTON GROUP / (${
        React.Children.toArray(this.props.children).length
      } children) children:`,
      this.props.children,
      'selectedIndex:',
      this.state.selectedItemIdx,
      'focused boolean:',
      this.props.focused,
    );

    let validChildCount = -1;
    return (
      <Wrapper onKeyDown={this.handleKeyDown} width={width}>
        {React.Children.map(children, (child, idx) => {
          if (this.isValidChild(child)) {
            validChildCount += 1;
            if (
              this.props.focused &&
              this.state.selectedItemIdx === validChildCount
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
                  this.props.focused &&
                  this.state.selectedItemIdx === validChildCount, //idx,
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
