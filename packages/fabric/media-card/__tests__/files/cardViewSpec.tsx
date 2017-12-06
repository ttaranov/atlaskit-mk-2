import * as React from 'react';
import { mount } from 'enzyme';

import { FileCardImageView } from '../../src/files';
import { CardOverlay } from '../../src/utils/cardImageView/cardOverlay';

describe('FileCardView', () => {
  it('should render card with non-persisting overlay when supplied mediaType is "image" and dataUri string is supplied', function() {
    const card = mount(
      <FileCardImageView mediaType="image" dataURI="data" status="complete" />,
    );
    expect(card.find(CardOverlay).props().persistent).toEqual(false);
  });

  it('should render empty wrapper when error prop is true', function() {
    const card = mount(
      <FileCardImageView error="Some random error occurred" status="error" />,
    );
    expect(card.find('.wrapper').children()).toHaveLength(0);
  });

  it('should render card overlay with the error prop true when supplied error prop is true', function() {
    const errorStr = 'Some random error occurred';
    const card = mount(<FileCardImageView error={errorStr} status="error" />);
    expect(card.find(CardOverlay).props().error).toEqual(errorStr);
  });

  it('should NOT render an overlay when loading prop is true', function() {
    const card = mount(<FileCardImageView status="loading" />);
    expect(card.find(CardOverlay)).toHaveLength(0);
  });
});
