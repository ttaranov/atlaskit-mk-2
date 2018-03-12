import * as React from 'react';
import { shallow } from 'enzyme';

import { UploadingView } from '../../src/utils/uploadingView';
import { MediaImage, CardActionsView } from '../../src/utils';
import { CardActionType } from '../../src/actions';

describe('UploadingView', () => {
  it('should not render the cancel action when deleteAction is not provided', () => {
    const card = shallow(<UploadingView progress={0} />);
    expect(card.find(CardActionsView)).toHaveLength(0);
  });

  it('should not render the cancel action when an action that is not type delete is provided', () => {
    const randomAction = { label: 'Close', type: undefined, handler: () => {} };
    const card = shallow(
      <UploadingView progress={0} actions={[randomAction]} />,
    );
    expect(card.find(CardActionsView)).toHaveLength(0);
  });

  it('should render the cancel action when a deleteAction is provided', () => {
    const deleteAction = {
      label: 'Delete',
      type: CardActionType.delete,
      handler: () => {},
    };
    const card = shallow(
      <UploadingView progress={0} actions={[deleteAction]} />,
    );
    expect(card.find(CardActionsView)).toHaveLength(1);
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
