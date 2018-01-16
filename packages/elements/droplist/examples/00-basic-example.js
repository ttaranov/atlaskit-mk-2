// @flow
import React, { PureComponent } from 'react';
import { Label } from '@atlaskit/field-base';
import Button from '@atlaskit/button';
import Item, { ItemGroup } from '@atlaskit/item';
import DropList from '../src';

type State = {|
  eventResult: string,
|};
export default class BasicExample extends PureComponent<void, State> {
  state = {
    eventResult: 'Click into and out of the content to trigger event handlers',
  };

  onKeyDown = () => {
    this.setState({
      eventResult: 'onKeyDown called',
    });
  };

  onClick = () => {
    this.setState({
      eventResult: 'onClick called',
    });
  };
  onOpenChange = () => {
    this.setState({
      eventResult: 'onOpenChange called',
    });
  };
  onItemActivated = () => {
    this.setState({
      eventResult: 'Item onActivated called',
    });
  };

  render() {
    return (
      <div>
        <Label label="With event handlers" />
        <DropList
          appearance="default"
          position="right top"
          isTriggerNotTabbable
          onOpenChange={this.onOpenChange}
          onClick={this.onClick}
          isOpen
          trigger={<Button isSelected>...</Button>}
        >
          <ItemGroup title="Australia">
            <Item href="//atlassian.com" target="_blank">
              Sydney
            </Item>
            <Item isHidden>Hidden item</Item>
            <Item isDisabled>Brisbane</Item>
            <Item>Canberra</Item>
            <Item onActivated={this.onItemActivated}>Melbourne</Item>
          </ItemGroup>
        </DropList>
        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        >
          {this.state.eventResult}
        </div>
        <Label label="Fit Container" />
        <DropList shouldFitContainer isOpen trigger={<Button>...</Button>}>
          <ItemGroup title="Australia">
            <Item>Sydney</Item>
            <Item isHidden>Hidden item</Item>
            <Item isDisabled>Brisbane</Item>
            <Item>Canberra</Item>
            <Item>Melbourne</Item>
          </ItemGroup>
        </DropList>
        <Label label="Multiline Items" />
        <DropList isOpen trigger={<Button>...</Button>}>
          <ItemGroup>
            <Item shouldAllowMultiline>
              What about if we put some really long content inside this dropdown
              menu
            </Item>
            <Item shouldAllowMultiline>
              And then we see how the text is hidden, okey now its going to be
              hidden
            </Item>
          </ItemGroup>
        </DropList>
      </div>
    );
  }
}
