import * as React from 'react';
import { PureComponent } from 'react';
import * as classNames from 'classnames';

import * as styles from './styles';
import { CategoryDescription, OnCategory } from '../../types';
import { customCategory, defaultCategories } from '../../constants';

import EmojiActivityIcon from '@atlaskit/icon/glyph/emoji/activity';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import EmojiFlagsIcon from '@atlaskit/icon/glyph/emoji/flags';
import EmojiFoodIcon from '@atlaskit/icon/glyph/emoji/food';
import EmojiFrequentIcon from '@atlaskit/icon/glyph/emoji/frequent';
import EmojiNatureIcon from '@atlaskit/icon/glyph/emoji/nature';
import EmojiObjectsIcon from '@atlaskit/icon/glyph/emoji/objects';
import EmojiPeopleIcon from '@atlaskit/icon/glyph/emoji/people';
import EmojiSymbolsIcon from '@atlaskit/icon/glyph/emoji/symbols';
import EmojiTravelIcon from '@atlaskit/icon/glyph/emoji/travel';

export interface Props {
  dynamicCategories?: string[];
  activeCategoryId?: string;
  disableCategories?: boolean;
  onCategorySelected?: OnCategory;
}

export interface State {
  categories: string[];
}

export type CategoryMap = {
  [id: string]: CategoryDescription;
};

// tslint:disable-next-line:variable-name
export const CategoryDescriptionMap: CategoryMap = {
  FREQUENT: {
    id: 'FREQUENT',
    name: 'Frequent',
    icon: EmojiFrequentIcon,
    order: 1,
  },
  PEOPLE: {
    id: 'PEOPLE',
    name: 'People',
    icon: EmojiPeopleIcon,
    order: 2,
  },
  NATURE: {
    id: 'NATURE',
    name: 'Nature',
    icon: EmojiNatureIcon,
    order: 3,
  },
  FOODS: {
    id: 'FOODS',
    name: 'Food & Drink',
    icon: EmojiFoodIcon,
    order: 4,
  },
  ACTIVITY: {
    id: 'ACTIVITY',
    name: 'Activity',
    icon: EmojiActivityIcon,
    order: 5,
  },
  PLACES: {
    id: 'PLACES',
    name: 'Travel & Places',
    icon: EmojiTravelIcon,
    order: 6,
  },
  OBJECTS: {
    id: 'OBJECTS',
    name: 'Objects',
    icon: EmojiObjectsIcon,
    order: 7,
  },
  SYMBOLS: {
    id: 'SYMBOLS',
    name: 'Symbols',
    icon: EmojiSymbolsIcon,
    order: 8,
  },
  FLAGS: {
    id: 'FLAGS',
    name: 'Flags',
    icon: EmojiFlagsIcon,
    order: 9,
  },
  ATLASSIAN: {
    id: 'ATLASSIAN',
    name: 'Atlassian',
    icon: EmojiAtlassianIcon,
    order: 10,
  },
  CUSTOM: {
    id: customCategory,
    name: 'Custom',
    icon: EmojiCustomIcon,
    order: 11,
  },
};

export const sortCategories = (c1, c2) =>
  CategoryDescriptionMap[c1].order - CategoryDescriptionMap[c2].order;

const addNewCategories = (
  oldCategories: string[],
  newCategories?: string[],
): string[] => {
  if (!newCategories) {
    return oldCategories;
  }
  return oldCategories
    .concat(
      newCategories.filter(category => !!CategoryDescriptionMap[category]),
    )
    .sort(sortCategories);
};

export default class CategorySelector extends PureComponent<Props, State> {
  static defaultProps = {
    onCategorySelected: () => {},
    dynamicCategories: [],
  };

  constructor(props: Props) {
    super(props);
    const { dynamicCategories } = props;

    let categories = defaultCategories;
    if (dynamicCategories) {
      categories = addNewCategories(categories, dynamicCategories);
    }
    this.state = {
      categories,
    };
  }

  onClick = categoryId => {
    const { onCategorySelected } = this.props;
    if (onCategorySelected) {
      onCategorySelected(categoryId);
    }
  };

  componentWillUpdate(nextProps: Props, nextState: State) {
    if (this.props.dynamicCategories !== nextProps.dynamicCategories) {
      this.setState({
        categories: addNewCategories(
          defaultCategories,
          nextProps.dynamicCategories,
        ),
      });
    }
  }

  render() {
    const { disableCategories } = this.props;
    const { categories } = this.state;
    let categoriesSection;
    if (categories) {
      categoriesSection = (
        <ul>
          {categories.map(categoryId => {
            const category = CategoryDescriptionMap[categoryId];
            const categoryClasses = [styles.category];
            if (categoryId === this.props.activeCategoryId) {
              categoryClasses.push(styles.active);
            }

            const onClick = e => {
              e.preventDefault();
              // ignore if disabled
              if (!disableCategories) {
                this.onClick(categoryId);
              }
            };
            if (disableCategories) {
              categoryClasses.push(styles.disable);
            }

            // tslint:disable-next-line:variable-name
            const Icon = category.icon;

            return (
              <li key={category.name}>
                <button
                  className={classNames(categoryClasses)}
                  onClick={onClick}
                  title={category.name}
                >
                  <Icon label={category.name} />
                </button>
              </li>
            );
          })}
        </ul>
      );
    }
    return (
      <div className={classNames([styles.categorySelector])}>
        {categoriesSection}
      </div>
    );
  }
}
