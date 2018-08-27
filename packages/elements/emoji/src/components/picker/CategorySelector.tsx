import * as React from 'react';
import { PureComponent } from 'react';
import * as classNames from 'classnames';

import * as styles from './styles';
import { CategoryDescription, OnCategory } from '../../types';
import { defaultCategories } from '../../constants';

import { CategoryDescriptionMap, CategoryId } from './categories';

export interface Props {
  dynamicCategories?: CategoryId[];
  activeCategoryId?: CategoryId;
  disableCategories?: boolean;
  onCategorySelected?: OnCategory;
}

export interface State {
  categories: CategoryId[];
}

export type CategoryMap = {
  [id: string]: CategoryDescription;
};

export const sortCategories = (c1, c2) =>
  CategoryDescriptionMap[c1].order - CategoryDescriptionMap[c2].order;

const addNewCategories = (
  oldCategories: CategoryId[],
  newCategories?: CategoryId[],
): CategoryId[] => {
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

  onClick = (categoryId: CategoryId) => {
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
          {categories.map((categoryId: CategoryId) => {
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
