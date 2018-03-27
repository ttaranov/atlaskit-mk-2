import * as React from 'react';
import * as PropTypes from 'prop-types';
import { MouseEvent, PureComponent } from 'react';
import * as classNames from 'classnames';
import * as uuid from 'uuid/v1';
import { List as VirtualList } from 'react-virtualized/dist/commonjs/List';

import {
  atlassianCategory,
  customCategory,
  defaultCategories,
  frequentCategory,
  MAX_ORDINAL,
  customTitle,
  userCustomTitle,
} from '../../constants';
import {
  EmojiDescription,
  EmojiId,
  OnCategory,
  OnEmojiEvent,
  ToneSelection,
  User,
} from '../../types';
import { sizes } from './EmojiPickerSizes';
import {
  CategoryHeadingItem,
  EmojisRowItem,
  LoadingItem,
  SearchItem,
  virtualItemRenderer,
  VirtualItem,
} from './EmojiPickerVirtualItems';
import * as Items from './EmojiPickerVirtualItems';
import * as styles from './styles';
import { EmojiContext } from '../common/internal-types';

const categoryClassname = 'emoji-category';

export interface OnSearch {
  (query: string): void;
}

export interface Props {
  emojis: EmojiDescription[];
  currentUser?: User;
  onEmojiSelected?: OnEmojiEvent;
  onEmojiActive?: OnEmojiEvent;
  onCategoryActivated?: OnCategory;
  onMouseLeave?: () => void;
  onMouseEnter?: () => void;
  selectedTone?: ToneSelection;
  onSearch?: OnSearch;
  loading?: boolean;
  query?: string;
}

export interface State {}

interface EmojiGroup {
  emojis: EmojiDescription[];
  title: string;
  category: string;
}

/**
 * Tracks which category is visible based on
 * scrollTop, and virtual rows.
 */
class CategoryTracker {
  private categoryToRow: Map<string, number>;
  private rowToCategory: Map<number, string>;

  constructor() {
    this.reset();
  }

  reset() {
    this.categoryToRow = new Map();
    this.rowToCategory = new Map();
  }

  add(category: string, row: number) {
    this.categoryToRow.set(category, row);
    this.rowToCategory.set(row, category);
  }

  getRow(category: string): number | undefined {
    return this.categoryToRow.get(category);
  }

  findNearestCategoryAbove(
    startIndex: number,
    list: VirtualList,
  ): string | undefined {
    const rows = Array.from(this.rowToCategory.keys()).sort((a, b) => a - b);
    if (rows.length === 0) {
      return;
    }

    // Return first category if list not yet rendered
    // or the top row is above the first category
    if (!list || rows[0] > startIndex) {
      return this.rowToCategory.get(rows[0]);
    }

    let bounds = [0, rows.length - 1];
    let index = Math.floor(rows.length / 2);

    while (rows[index] !== startIndex && bounds[0] < bounds[1]) {
      if (rows[index] > startIndex) {
        bounds[1] = Math.max(index - 1, 0);
      } else {
        bounds[0] = index + 1;
      }
      index = Math.floor((bounds[0] + bounds[1]) / 2);
    }

    const headerRow =
      rows[rows[index] > startIndex ? Math.max(index - 1, 0) : index];

    return this.rowToCategory.get(headerRow);
  }
}

const titleOrder = [
  frequentCategory,
  ...defaultCategories,
  atlassianCategory,
  userCustomTitle,
  customTitle,
];

const titleComparator = (eg1: EmojiGroup, eg2: EmojiGroup): number => {
  let title1 = titleOrder.indexOf(eg1.title);
  let title2 = titleOrder.indexOf(eg2.title);

  title1 = title1 === -1 ? MAX_ORDINAL : title1;
  title2 = title2 === -1 ? MAX_ORDINAL : title2;

  return title1 - title2;
};

export default class EmojiPickerVirtualList extends PureComponent<
  Props,
  State
> {
  static contextTypes = {
    emoji: PropTypes.object,
  };

  static childContextTypes = {
    emoji: PropTypes.object,
  };

  static defaultProps = {
    onEmojiSelected: () => {},
    onEmojiActive: () => {},
    onCategoryActivated: () => {},
    onSearch: () => {},
  };

  private idSuffix = uuid();
  private allEmojiGroups: EmojiGroup[];
  private activeCategory: string | undefined | null;
  private virtualItems: VirtualItem<any>[] = [];
  private categoryTracker: CategoryTracker = new CategoryTracker();

  context: EmojiContext;

  constructor(props) {
    super(props);

    this.buildGroups(props.emojis, props.currentUser);
    this.buildVirtualItems(props, this.state);
  }

  getChildContext(): EmojiContext {
    const { emoji } = this.context;
    return {
      emoji: {
        ...emoji,
      },
    };
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    if (
      this.props.emojis !== nextProps.emojis ||
      this.props.selectedTone !== nextProps.selectedTone ||
      this.props.loading !== nextProps.loading ||
      this.props.query !== nextProps.query
    ) {
      if (!nextProps.query) {
        // Only refresh if no query
        this.buildGroups(nextProps.emojis, nextProps.currentUser);
      }
      this.buildVirtualItems(nextProps, nextState);
    }
  }

  private onEmojiMouseEnter = (
    emojiId: EmojiId,
    emoji: EmojiDescription,
    event: MouseEvent<any>,
  ) => {
    if (this.props.onEmojiActive) {
      this.props.onEmojiActive(emojiId, emoji);
    }
  };

  private onSearch = e => {
    if (this.props.onSearch) {
      this.props.onSearch(e.target.value);
    }
  };

  /**
   * Scrolls to a category in the list view
   */
  reveal(category: string) {
    const row = this.categoryTracker.getRow(category);
    const list = this.refs.list as VirtualList;
    list.scrollToRow(row);
  }

  scrollToBottom() {
    const list = this.refs.list as VirtualList;
    list.scrollToRow(this.virtualItems.length);
  }

  private categoryId = category => `category_${category}_${this.idSuffix}`;

  private buildCategory = (group: EmojiGroup): VirtualItem<any>[] => {
    const { onEmojiSelected } = this.props;
    const items: VirtualItem<any>[] = [];

    items.push(
      new CategoryHeadingItem({
        id: this.categoryId(group.category),
        title: group.title,
        className: categoryClassname,
      }),
    );

    let remainingEmojis = group.emojis;
    while (remainingEmojis.length > 0) {
      const rowEmojis = remainingEmojis.slice(0, sizes.emojiPerRow);
      remainingEmojis = remainingEmojis.slice(sizes.emojiPerRow);

      items.push(
        new EmojisRowItem({
          emojis: rowEmojis,
          title: group.title,
          onSelected: onEmojiSelected,
          onMouseMove: this.onEmojiMouseEnter,
        }),
      );
    }

    return items;
  };

  private buildVirtualItems = (props: Props, state: State): void => {
    const { emojis, loading, query } = props;

    let items: Items.VirtualItem<any>[] = [];

    this.categoryTracker.reset();

    items.push(
      new SearchItem({
        onChange: this.onSearch,
        query,
      }),
    );

    if (loading) {
      items.push(new LoadingItem());
    } else {
      if (query) {
        // Only a single "result" category
        items = [
          ...items,
          ...this.buildCategory({
            category: 'Search',
            title: 'Search results',
            emojis,
          }),
        ];
      } else {
        // Group by category

        // Not searching show in categories.
        this.allEmojiGroups.forEach(group => {
          // Optimisation - avoid re-rendering unaffected groups for the current selectedShortcut
          // by not passing it to irrelevant groups
          this.categoryTracker.add(group.category, items.length);

          items = [...items, ...this.buildCategory(group)];
        });
      }
    }

    const rowCountChanged = this.virtualItems.length !== items.length;

    this.virtualItems = items;

    const list = this.refs.list as VirtualList;

    if (!rowCountChanged && list) {
      // Row count has not changed, so need to tell list to rerender.
      list.forceUpdateGrid();
    }
    if (!query && list) {
      // VirtualList can apply stale heights since it performs a shallow
      // compare to check if the list has changed. Should manually recompute
      // row heights for the case when frequent category come in later
      list.recomputeRowHeights();
    }
  };

  private buildGroups = (
    emojis: EmojiDescription[],
    currentUser?: User,
  ): void => {
    const existingCategories = new Map();

    let currentGroup;
    let currentCategory: string | undefined;

    let userCustomGroup: EmojiGroup = {
      emojis: [],
      title: userCustomTitle,
      category: customCategory,
    };

    const list: EmojiGroup[] = [];

    for (let i = 0; i < emojis.length; i++) {
      let emoji = emojis[i];

      if (currentCategory !== emoji.category) {
        currentCategory = emoji.category;
        if (existingCategories.has(currentCategory)) {
          currentGroup = existingCategories.get(currentCategory);
        } else {
          currentGroup = {
            emojis: [],
            title:
              currentCategory === customCategory
                ? customTitle
                : currentCategory,
            category: currentCategory,
          };
          existingCategories.set(currentCategory, currentGroup);
          list.push(currentGroup);
        }
      }
      currentGroup.emojis.push(emoji);

      // separate user emojis
      if (
        currentCategory === customCategory &&
        emoji &&
        currentUser &&
        emoji.creatorUserId === currentUser.id
      ) {
        userCustomGroup.emojis.push(emoji);
      }
    }
    if (userCustomGroup.emojis.length > 0) {
      list.push(userCustomGroup);
    }
    this.allEmojiGroups = list.sort(titleComparator);
  };

  private repaintList = () => {
    if (this.refs.root) {
      const root = this.refs.root as HTMLDivElement;
      const display = root.style.display;
      root.style.display = 'none';
      // tslint:disable-next-line:no-unused-expression no-unused-variable we need to access offset to force repaint
      root.offsetHeight;
      root.style.display = display;
    }
  };

  private checkCategoryChange = indexes => {
    const { startIndex } = indexes;

    // FS-1844 Fix a rendering problem when scrolling to the top
    if (startIndex === 0) {
      this.repaintList();
    }

    if (!this.props.query) {
      // Calculate category in view - only relevant if categories shown, i.e. no query
      const list = this.refs.list as VirtualList;
      const currentCategory = this.categoryTracker.findNearestCategoryAbove(
        startIndex,
        list,
      );

      if (currentCategory && this.activeCategory !== currentCategory) {
        this.activeCategory = currentCategory;
        if (this.props.onCategoryActivated) {
          this.props.onCategoryActivated(currentCategory);
        }
      }
    }
  };

  private rowSize = ({ index }) => this.virtualItems[index].height;
  private renderRow = context =>
    virtualItemRenderer(this.virtualItems, context);

  render() {
    const { onMouseLeave, onMouseEnter } = this.props;
    const classes = [styles.emojiPickerList];

    return (
      <div
        ref="root"
        className={classNames(classes)}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
      >
        <VirtualList
          ref="list"
          height={sizes.listHeight}
          overscanRowCount={5}
          rowCount={this.virtualItems.length}
          rowHeight={this.rowSize}
          rowRenderer={this.renderRow}
          scrollToAlignment="start"
          width={sizes.listWidth}
          className={styles.virtualList}
          onRowsRendered={this.checkCategoryChange}
        />
      </div>
    );
  }
}
