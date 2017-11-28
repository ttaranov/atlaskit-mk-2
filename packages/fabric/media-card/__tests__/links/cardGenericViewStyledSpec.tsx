/**
 * @jest-environment node
 * @see https://github.com/styled-components/jest-styled-components#styled-components--v2
 */
import * as React from 'react';
import { shallow } from 'enzyme';
import { Thumbnail } from '../../src/links/cardGenericView/styled';

describe('LinkCardGenericView styles', () => {
  it('Thumbnail should extend MediaImage and use default crop', () => {
    const card = shallow(<Thumbnail dataURI="" appearance="auto" />);

    expect(card).toMatchSnapshot();
  });
});
