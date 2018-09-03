import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import { MediaItem, MediaItemType } from '@atlaskit/media-core';
import { createContext } from '../_stubs';
import { MediaViewer } from '../../src/newgen/media-viewer';
import { FeedbackWrapper } from '../../src/newgen/styled';
import { ItemSource, Identifier } from '../../src/newgen/domain';
import { FeedbackButton } from '../../src/newgen/feedback-button';

function createFixture(items: Identifier[], identifier: Identifier) {
  const subject = new Subject<MediaItem>();
  const context = createContext({ subject });
  const itemSource: ItemSource = {
    kind: 'ARRAY',
    items,
  };
  const el = mount(
    <MediaViewer
      selectedItem={identifier}
      itemSource={itemSource}
      context={context}
    />,
  );
  return { subject, el };
}

const identifier = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  type: 'file' as MediaItemType,
};

describe('FeedbackButton', () => {
  it('should show the feedback button', () => {
    const { el } = createFixture([identifier], identifier);
    el.find(FeedbackButton).simulate('click');
    el.update();
    expect(el.find(FeedbackWrapper)).toHaveLength(1);
  });
});
