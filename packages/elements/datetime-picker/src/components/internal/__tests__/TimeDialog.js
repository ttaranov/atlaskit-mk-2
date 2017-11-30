// @flow

import React from 'react';
import { shallow } from 'enzyme';
import Droplist from '@atlaskit/droplist';
import { name } from '../../../../package.json';
import TimeDialog from '../TimeDialog';
import TimeDialogItem from '../TimeDialogItem';

describe(name, () => {
  describe('TimeDialog', () => {
    it('should render a Droplist containing a TimeDialogItem for each item', () => {
      const testItems = ['1', '2', '3'];
      const wrapper = shallow(<TimeDialog times={testItems} />);

      expect(wrapper.find(Droplist)).toHaveLength(1);
      expect(wrapper.find(TimeDialogItem)).toHaveLength(testItems.length);
      testItems.forEach((item, index) => {
        expect(wrapper.find(TimeDialogItem).at(index).props().value).toBe(item);
      });
    });
  });
});
