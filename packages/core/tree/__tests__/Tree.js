// @flow
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Tree from '../src/index';

configure({ adapter: new Adapter() });

describe('@atlaskit/tree', () => {
  it('create tree component', () =>
    expect(
      mount(<Tree />)
        .find(Tree)
        .exists(),
    ).toBe(true));
});
