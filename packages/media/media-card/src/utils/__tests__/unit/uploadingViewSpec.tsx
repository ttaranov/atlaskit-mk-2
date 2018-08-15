import * as React from 'react';
import { shallow } from 'enzyme';

import { UploadingView } from '../../uploadingView';
import { MediaImage, CardActionsView } from '../..';

describe('UploadingView', () => {
  it('should render card actions with provided actions', () => {
    const actions = [
      {
        label: 'Delete',
        handler: () => {},
      },
    ];
    const card = shallow(<UploadingView progress={0} actions={actions} />);

    expect(card.find(CardActionsView).prop('actions')).toEqual(actions);
  });

  it('should not render the image when dataURI is not provided', () => {
    const card = shallow(<UploadingView progress={0} />);
    expect(card.find(MediaImage)).toHaveLength(0);
  });

  it('should render the image when dataURI is provided', () => {
    const card = shallow(<UploadingView progress={0} dataURI="data:png" />);
    expect(card.find(MediaImage)).toHaveLength(1);
  });
});
