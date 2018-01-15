import { storiesOf } from '@kadira/storybook';
import React from 'react';
import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button';
import Lozenge from '@atlaskit/lozenge';
import Arrow from '@atlaskit/icon/glyph/arrow-right';

import DropList, {
  Item as DeprecatedItem,
  Group as DeprecatedGroup,
} from '../src';
import { GroupsWrapper } from './styled/StoryHelpers';

import { name } from '../package.json';

storiesOf(`${name} - deprecated API`, module)
  .add('simple example of deprecated elements', () => (
    <GroupsWrapper>
      <DropList
        appearance="default"
        isOpen
        isTriggerNotTabbable
        onOpenChange={(attrs) => {
          console.log('isOpen', attrs.isOpen);
        }}
        position="right top"
        trigger={<Button isSelected>...</Button>}
      >
        <DeprecatedGroup heading="Australia">
          <DeprecatedItem href="//atlassian.com" target="_blank">Sydney</DeprecatedItem>
          <DeprecatedItem isHidden>Hidden item</DeprecatedItem>
          <DeprecatedItem>Canberra</DeprecatedItem>
          <DeprecatedItem
            onActivated={(attrs) => {
              console.log(attrs.item);
            }}
          >Melbourne</DeprecatedItem>
        </DeprecatedGroup>
      </DropList>
    </GroupsWrapper>
  ))
  .add('deprecated shouldAllowMultilineItems', () => (
    <GroupsWrapper>
      <div style={{ width: 400 }}>
        <DropList
          isOpen
          shouldFitContainer
          trigger={
            <Button>This is the trigger</Button>
          }
          shouldAllowMultilineItems
        >
          <DeprecatedGroup title="Allow multiline">
            <DeprecatedItem>
              What about if we put some really long content inside this droplist item,
              it should break onto new lines.
            </DeprecatedItem>
          </DeprecatedGroup>
        </DropList>
      </div>
    </GroupsWrapper>
  ))
  .add('deprecated layout styles', () => (
    <GroupsWrapper>
      <div style={{ width: 400 }}>
        <DropList
          appearance="default"
          isOpen
          isTriggerNotTabbable
          onOpenChange={(attrs) => {
            console.log('isOpen', attrs.isOpen);
          }}
          position="right top"
          trigger={<Button isSelected>...</Button>}
        >
          <DeprecatedGroup heading="Different layouts">
            <DeprecatedItem elemBefore={<Avatar size="small" />}>With elemBefore set</DeprecatedItem>
            <DeprecatedItem
              elemAfter={
                <div style={{ display: 'flex', alignItems: 'center', width: '105px' }}>
                  <Arrow label="" /><Lozenge appearance="success">done</Lozenge>
                </div>
              }
            >With extra space afterwards</DeprecatedItem>
            <DeprecatedItem tooltipDescription="I'm a tooltip" tooltipPosition="right">Tooltip on the right</DeprecatedItem>
            <DeprecatedItem type="option">Option item</DeprecatedItem>
            <DeprecatedItem type="radio">Radio</DeprecatedItem>
            <DeprecatedItem type="checkbox">Checkbox</DeprecatedItem>
            <DeprecatedItem description="A sub line here">With description</DeprecatedItem>
            <DeprecatedItem>
              A really quite truly long item that should be truncated without a doubt
            </DeprecatedItem>
          </DeprecatedGroup>
        </DropList>
      </div>
    </GroupsWrapper>
  ));
