/**
 * <Toolbar items={items} width={width}>
 *  <ToolbarGroup id="text-formatting" priority={0.8} buttons={3} collapse={true} />
 *  <ToolbarGroup id="list" priority={1} buttons={2} />
 *  <ToolbarGroup id="insert" priority={1} buttons={5} collapse={true} />
 * </Toolbar>
 *
 * Calculating:
 *  1. Split items by group
 *  2. Filter out empty groups
 *  3. Sort groups by priority:
 *     [list, insert, text-formatting]
 *  4. Calculate possible sizes (button = 32, if collapse=true then we have dropdown = 40):
 *     list = [64]
 *     insert = [200, 168, 136, 104, 72, 40]
 *     text-formatting = [136, 104, 72, 40]
 *  5. Find width that fit groups the best:
 *     width = 500: [[text-formatting 136], [list 64], [insert 200]] === 400
 *     width = 370: [[text-formatting 104 (-1 button)], [list 64], [insert 200]] === 368
 *     width = 350: [[text-formatting 72 (-2 button)], [list 64], [insert 200]] === 336
 *  6. Inside group do collapsing logic:
 *     maxWidth / itemWidth = itemsToRender
 *     maxItems.take(itemsToRender)
 *     dropdown(maxItems.slice(itemsToRender - 1))
 */

import * as React from 'react';
import SizeDetector from '@atlaskit/size-detector';
import styled from 'styled-components';
import ToolbarBlockType from '../src/ui/ToolbarBlockType';
import ToolbarButton from '../src/ui/ToolbarButton';
import DropList from '@atlaskit/droplist';
import Item, { ItemGroup } from '@atlaskit/item';
import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';
import UnderlineIcon from '@atlaskit/icon/glyph/editor/underline';
import BulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import NumberListIcon from '@atlaskit/icon/glyph/editor/number-list';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import AttachmentIcon from '@atlaskit/icon/glyph/editor/attachment';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import TableIcon from '@atlaskit/icon/glyph/editor/table';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import {
  NORMAL_TEXT,
  HEADING_1,
  HEADING_2,
  HEADING_3,
  HEADING_4,
  HEADING_5,
} from '../src/plugins/block-type/types';
import withOuterListeners from '../src/ui/with-outer-listeners';
import { TextFormattingIcon } from '../src/ui/ToolbarAdvancedTextFormatting';
import { ListIcon } from '../src/ui/ToolbarLists';
import { InsertBlockIcon } from '../src/ui/ToolbarInsertBlock';
import ToolbarHelp from './../src/editor/ui/ToolbarHelp';
import ToolbarFeedback from '../src/ui/ToolbarFeedback';

const DropListWithOutsideListeners: any = withOuterListeners(DropList);

const ToolbarGroupStyled = styled.div`
  border-left: ${props => (props.border ? '1px solid #EBECF0' : 'none')};
  padding-left: ${props => (props.border ? '10px' : '0')};
  padding-right: 10px;
  display: flex;
`;

class LayoutsContainer extends React.Component<{ width: number }> {
  render() {
    return (
      <div>
        {React.Children.map(this.props.children, (component, key) => {
          return React.cloneElement(component, {
            width: this.props.width,
          });
        })}
      </div>
    );
  }
}

function LayoutManager({ children }) {
  return (
    <SizeDetector>
      {({ width }) => (
        <LayoutsContainer width={width}>{children}</LayoutsContainer>
      )}
    </SizeDetector>
  );
}

function Layout({
  maxWidth = Infinity,
  minWidth = -Infinity,
  width = 0,
  render = (props: { width: number }): any => null,
}) {
  return maxWidth >= width && minWidth <= width ? render({ width }) : null;
}

const clalcGroupWidths = (buttonSize = 40, dropdownSize = 40, group, items) => {
  let { buttons, collapse } = group;
  const sizes = [];
  if (!collapse) {
    sizes.push(buttons * buttonSize);
  } else {
    while (buttons >= 0) {
      sizes.push(
        buttons * buttonSize +
          (collapse && items.length > buttons ? dropdownSize : 0),
      );
      buttons--;
    }
  }

  group.sizes = sizes
    .filter(
      (size, index) =>
        index > 0 ? (sizes[index - 1] < size ? false : true) : true,
    )
    .reduce(
      (acc, item) => (acc.indexOf(item) > -1 ? acc : acc.concat([item])),
      [],
    );

  return group;
};

const bestWidthForGroups = (width, groups) => {
  let bestWidth = {};
  let totalWidth = Infinity;
  let leastPriorityGroup = groups.length - 1;
  let indexInGroup = 0;
  while (width < totalWidth) {
    bestWidth = groups.reduce((acc, gr, index) => {
      acc[gr.id] = 0;
      if (index < leastPriorityGroup) {
        acc[gr.id] = gr.sizes[0];
      } else if (index === leastPriorityGroup) {
        acc[gr.id] = gr.sizes[indexInGroup];
      } else {
        acc[gr.id] = gr.sizes[gr.sizes.length - 1];
      }
      return acc;
    }, {});
    indexInGroup += 1;
    totalWidth = Object.keys(bestWidth).reduce(
      (acc, key) => acc + bestWidth[key],
      0,
    );
    if (indexInGroup >= groups[leastPriorityGroup].sizes.length) {
      indexInGroup = 0;
      leastPriorityGroup -= 1;

      if (leastPriorityGroup < 0) {
        return bestWidth;
      }
    }
  }
  return bestWidth;
};

const ToolbarGroupDeclaration = () => null;

class ToolbarGroup extends React.Component<any, any> {
  state = { isDropdownOpen: false };

  private handleClose = () => {
    this.setState({ isDropdownOpen: false });
  };

  private toggleDropdown = () => {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  };

  render() {
    const { isDropdownOpen } = this.state;
    const {
      buttons,
      maxWidth,
      items,
      border,
      collapse,
      dropdownIcon = () => null,
    } = this.props;
    const count = Math.min(maxWidth / 40, buttons);
    const itemsToRender = collapse
      ? items.slice(
          0,
          Math.ceil(items.length - count) === 1 ? count - 1 : count,
        )
      : items;
    const dropdownItems = collapse ? items.slice(itemsToRender.length) : [];

    return (
      <ToolbarGroupStyled border={border}>
        {itemsToRender.map(item => item.render({ type: 'button' }))}
        {!!dropdownItems.length && (
          <ToolbarButton
            selected={isDropdownOpen}
            onClick={this.toggleDropdown}
            iconBefore={dropdownIcon()}
          />
        )}
        {!!dropdownItems.length &&
          isDropdownOpen && (
            <DropListWithOutsideListeners
              isOpen={true}
              appearance="tall"
              shouldFlip={false}
              shouldFitContainer={true}
              isTriggerNotTabbable={true}
              handleClickOutside={this.handleClose}
              handleEscapeKeydown={this.handleClose}
              position={'bottom left'}
            >
              <ItemGroup>
                {dropdownItems.map(item => item.render({ type: 'dropdown' }))}
              </ItemGroup>
            </DropListWithOutsideListeners>
          )}
      </ToolbarGroupStyled>
    );
  }
}

function Toolbar({ items, width, children }: any) {
  const allGroups: Array<{
    id: string;
    priority: number;
    buttons: number;
  }> = React.Children.map(children, (child: any) => ({ ...child.props }));

  const groupedItems = items.reduce((acc, item) => {
    const group = item.groups.find(gr => allGroups.find(({ id }) => gr === id));
    if (group) {
      acc[group] = (acc[group] || []).concat([item]);
    }
    return acc;
  }, {});

  const groupsWithItems = allGroups.filter(
    gr => Object.keys(groupedItems).indexOf(gr.id) > -1,
  );

  const groupsByPriority = []
    .concat(groupsWithItems)
    .sort(
      (a, b) =>
        a.priority > b.priority ? -1 : a.priority === b.priority ? 0 : 1,
    )
    .reduce(
      (acc, gr) =>
        acc.concat([clalcGroupWidths(40, 40, gr, groupedItems[gr.id])]),
      [],
    );

  const groupWidth = bestWidthForGroups(width, groupsByPriority);

  // console.log('width: ', width);
  // console.log('groupedItmes', groupedItems);
  // console.log('groupsWithItems: ', groupsWithItems);
  // console.log('groupsByPriority: ', groupsByPriority);
  // console.log('groupWidth: ', groupWidth);

  return (
    <div style={{ display: 'flex', height: 32 }}>
      {groupsWithItems.map(gr => (
        <ToolbarGroup
          {...gr}
          items={groupedItems[gr.id]}
          maxWidth={groupWidth[gr.id]}
        />
      ))}
    </div>
  );
}

const items = [
  {
    groups: ['text-formatting'],
    render: ({ type }) =>
      type === 'button' ? (
        <ToolbarButton iconBefore={<BoldIcon label="Bold" />} />
      ) : (
        <Item>Bold</Item>
      ),
  },
  {
    groups: ['text-formatting'],
    render: ({ type }) =>
      type === 'button' ? (
        <ToolbarButton iconBefore={<ItalicIcon label="Italic" />} />
      ) : (
        <Item>Italic</Item>
      ),
  },
  {
    groups: ['text-formatting'],
    render: ({ type }) =>
      type === 'button' ? (
        <ToolbarButton iconBefore={<UnderlineIcon label="Underline" />} />
      ) : (
        <Item>Underline</Item>
      ),
  },
  {
    groups: ['list'],
    render: ({ type }) =>
      type === 'button' ? (
        <ToolbarButton iconBefore={<BulletListIcon label="Bullet" />} />
      ) : (
        <Item>Bullet</Item>
      ),
  },
  {
    groups: ['list'],
    render: ({ type }) =>
      type === 'button' ? (
        <ToolbarButton iconBefore={<NumberListIcon label="Number" />} />
      ) : (
        <Item>Number</Item>
      ),
  },
  {
    groups: ['insert'],
    render: ({ type }) =>
      type === 'button' ? (
        <ToolbarButton iconBefore={<LinkIcon label="Link" />} />
      ) : (
        <Item>Link</Item>
      ),
  },
  {
    groups: ['insert'],
    render: ({ type }) =>
      type === 'button' ? (
        <ToolbarButton iconBefore={<AttachmentIcon label="Attachement" />} />
      ) : (
        <Item>Attachment</Item>
      ),
  },
  {
    groups: ['insert'],
    render: ({ type }) =>
      type === 'button' ? (
        <ToolbarButton iconBefore={<MentionIcon label="Mention" />} />
      ) : (
        <Item>Mention</Item>
      ),
  },
  {
    groups: ['insert'],
    render: ({ type }) =>
      type === 'button' ? (
        <ToolbarButton iconBefore={<EmojiIcon label="Emoji" />} />
      ) : (
        <Item>Emoji</Item>
      ),
  },
  {
    groups: ['insert'],
    render: ({ type }) =>
      type === 'button' ? (
        <ToolbarButton iconBefore={<TableIcon label="Table" />} />
      ) : (
        <Item>Table</Item>
      ),
  },
];

const BlockType = ({ isSmall }) => (
  <ToolbarBlockType
    editorWidth={isSmall ? 700 : 800}
    editorView={{}}
    pluginState={{
      subscribe() {},
      unsubscribe() {},
      currentBlockType: NORMAL_TEXT,
      availableBlockTypes: [
        NORMAL_TEXT,
        HEADING_1,
        HEADING_2,
        HEADING_3,
        HEADING_4,
        HEADING_5,
      ],
    }}
  />
);

export default function Example() {
  return (
    <div>
      <LayoutManager>
        <Layout
          minWidth={640}
          render={() => (
            <div style={{ display: 'flex' }}>
              <BlockType isSmall={false} />
              <SizeDetector>
                {({ width }) => (
                  <Toolbar items={items} width={width}>
                    <ToolbarGroupDeclaration
                      id="text-formatting"
                      priority={0.8}
                      buttons={3}
                      collapse={true}
                      dropdownIcon={TextFormattingIcon}
                    />
                    <ToolbarGroupDeclaration
                      id="list"
                      priority={1}
                      buttons={2}
                      border={true}
                    />
                    <ToolbarGroupDeclaration
                      id="insert"
                      priority={1}
                      buttons={5}
                      collapse={true}
                      border={true}
                      dropdownIcon={InsertBlockIcon}
                    />
                  </Toolbar>
                )}
              </SizeDetector>
              <div style={{ height: 32, display: 'flex' }}>
                <ToolbarButton
                  title="Open help dialog"
                  titlePosition="left"
                  iconBefore={<QuestionIcon label="Open help dialog" />}
                />
              </div>
            </div>
          )}
        />
        <Layout
          minWidth={300}
          maxWidth={639}
          render={() => (
            <div style={{ display: 'flex' }}>
              <BlockType isSmall={true} />
              <SizeDetector>
                {({ width }) => (
                  <Toolbar items={items} width={width}>
                    <ToolbarGroupDeclaration
                      id="text-formatting"
                      priority={0.8}
                      buttons={3}
                      collapse={true}
                      dropdownIcon={TextFormattingIcon}
                    />
                    <ToolbarGroupDeclaration
                      id="list"
                      priority={1}
                      buttons={2}
                      border={true}
                    />
                    <ToolbarGroupDeclaration
                      id="insert"
                      priority={1}
                      buttons={5}
                      collapse={true}
                      border={true}
                      dropdownIcon={InsertBlockIcon}
                    />
                  </Toolbar>
                )}
              </SizeDetector>
              <div style={{ height: 32, display: 'flex' }}>
                <ToolbarButton
                  title="Open help dialog"
                  titlePosition="left"
                  iconBefore={<QuestionIcon label="Open help dialog" />}
                />
              </div>
            </div>
          )}
        />
        <Layout
          maxWidth={299}
          render={({ width }) => (
            <div style={{ display: 'flex' }}>
              <BlockType isSmall={true} />
              <SizeDetector>
                {({ width }) => (
                  <Toolbar items={items} width={width}>
                    <ToolbarGroupDeclaration
                      id="text-formatting"
                      priority={1}
                      buttons={0}
                      collapse={true}
                      dropdownIcon={TextFormattingIcon}
                    />
                    <ToolbarGroupDeclaration
                      id="list"
                      priority={1}
                      buttons={0}
                      collapse={true}
                      border={true}
                      dropdownIcon={ListIcon}
                    />
                    <ToolbarGroupDeclaration
                      id="insert"
                      priority={1}
                      buttons={0}
                      collapse={true}
                      dropdownIcon={InsertBlockIcon}
                    />
                  </Toolbar>
                )}
              </SizeDetector>
              <div style={{ height: 32, display: 'flex' }}>
                <ToolbarButton
                  title="Open help dialog"
                  titlePosition="left"
                  iconBefore={<QuestionIcon label="Open help dialog" />}
                />
              </div>
            </div>
          )}
        />
      </LayoutManager>
    </div>
  );
}
