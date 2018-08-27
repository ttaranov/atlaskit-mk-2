import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';

import { defaultCategories } from '../../../../constants';
import * as styles from '../../../../components/picker/styles';
import CategorySelector, {
  Props,
  sortCategories,
} from '../../../../components/picker/CategorySelector';
import { CategoryDescriptionMap } from '../../../../components/picker/categories';

const setupComponent = (props?: Props): ReactWrapper<any, any> =>
  mount(<CategorySelector {...props} />);

describe('<CategorySelector />', () => {
  it('all standard categories visible by default', () => {
    const component = setupComponent();
    const categoryButtons = component.find('button');
    expect(categoryButtons.length, 'Number of categories').to.be.equal(
      defaultCategories.length,
    );
  });

  it('adds categories dynamically based on what has been passed in', () => {
    const component = setupComponent({
      dynamicCategories: ['CUSTOM', 'FREQUENT'],
    });
    const categoryButtons = component.find('button');
    expect(categoryButtons.length, 'Number of categories').to.be.equal(
      defaultCategories.length + 2,
    );
  });

  it('displays categories in sorted order', () => {
    // @ts-ignore
    const dynamicCategories: CategoryId[] = ['CUSTOM', 'FREQUENT', 'ATLASSIAN'];
    const component = setupComponent({
      dynamicCategories,
    });
    const orderedCategories = dynamicCategories
      .concat(defaultCategories)
      .sort(sortCategories);
    const categoryButtons = component.find('button');
    orderedCategories.forEach((categoryId, i) => {
      const button = categoryButtons.at(i);
      expect(button.prop('title'), `Button #${i}`).to.equal(
        CategoryDescriptionMap[categoryId].name,
      );
    });
  });

  it('all categories disabled if flag is set', () => {
    const component = setupComponent({ disableCategories: true });
    const categoryButtons = component.find('button');
    expect(categoryButtons.length, 'Number of categories').to.be.equal(
      defaultCategories.length,
    );
    defaultCategories.forEach((categoryId, i) => {
      const button = categoryButtons.at(i);
      expect(button.prop('title'), `Button #${i}`).to.equal(
        CategoryDescriptionMap[categoryId].name,
      );
      expect(
        button.hasClass(styles.disable),
        `Button #${i} is disabled`,
      ).to.equal(true);
    });
  });

  it('onCategorySelected called which clicking a category', () => {
    let selectedCategoryId;
    const component = setupComponent({
      dynamicCategories: ['CUSTOM', 'FREQUENT'],
      onCategorySelected: id => {
        selectedCategoryId = id;
      },
    });
    const categoryButtons = component.find('button');
    categoryButtons.at(defaultCategories.length + 1).simulate('click');
    expect(selectedCategoryId, 'Category was selected').to.equal('CUSTOM');
  });

  it('active category highlighted', () => {
    const activeCategoryId = defaultCategories[3];
    const component = setupComponent({
      activeCategoryId,
    });
    const categoryButtons = component.find('button');
    expect(categoryButtons.length, 'Number of categories').to.be.equal(
      defaultCategories.length,
    );
    defaultCategories.forEach((categoryId, i) => {
      const button = categoryButtons.at(i);
      expect(button.prop('title'), `Button #${i}`).to.equal(
        CategoryDescriptionMap[categoryId].name,
      );
      const shouldBeActive = i === 3;
      expect(
        button.hasClass(styles.active),
        `Button #${i} active=${shouldBeActive}`,
      ).to.equal(shouldBeActive);
    });
  });
});
