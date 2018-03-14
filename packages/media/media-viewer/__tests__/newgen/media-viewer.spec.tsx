import * as React from 'react';
import { mount } from 'enzyme';
import Blanket from '@atlaskit/blanket';
import { MediaViewer } from '../../src/newgen/media-viewer';

describe('<MediaViewer />', () => {
  it('should close Media Viewer on click', () => {
    const onClose = jest.fn();
    const el = mount(<MediaViewer onClose={onClose} />);
    el.find(Blanket).simulate('click');
    expect(onClose).toHaveBeenCalled();
  });

  const context = {};

  it.skip('shows only one item', () => {
    const onClose = jest.fn();
    const item = '';
    //
    const el = mount(
      <MediaViewer item={item} context={context} onClose={onClose} />,
    );
    const el = mount(
      <MediaViewer list={[item]} context={context} onClose={onClose} />,
    );
  });

  it.skip('shows a list of items', () => {
    const onClose = jest.fn();
    const list = ['a', 'b'];
    const selected = 'a';
    const el = mount(
      <MediaViewer
        list={list}
        selected={selected}
        context={context}
        onClose={onClose}
      />,
    );
  });

  it.skip('shows a selected file from a collection', () => {
    const onClose = jest.fn();
    const collection;
    const selected;
    const el = mount(
      <MediaViewer
        colection={colection}
        selected={selected}
        context={context}
        onClose={onClose}
      />,
    );
  });

  it.skip('shows the most recent file from collection', () => {
    const onClose = jest.fn();
    const collection;
    const el = mount(
      <MediaViewer colection={colection} context={context} onClose={onClose} />,
    );
  });

  // COMPILE TIME CHECK
  // rule: can not pass list and collection at the same

  // RUNTIME WITH ERROR MESSAGE
  //
  // rule: if you pass a collection, you could pass "selected" item
  // rule: if you pass a list, you could pass "selected" item
  // very well possible at runtime! (if file got deleted)
  // handle this gracefully? - eg tell the user that the selected file could not be found?
  // TODO run this through scotty
  //
  // rule: zero-item? / rule: zero collection?
  // a collection could have all links - so we again have nothing to display
  // tell the user that something is odd - we again have nothing to display
  // TODO run this through scotty

  // don't have at the moment: "follow a collection and all updates" (eg insert / delete / update)
  // no support for that in the platform at the moment - this is what observables are great for!

  /*
    data source concept: current media viewer 

    - show a list of files from an array
      - show a single file
        - left/right not possible
    - show one file from an entire collection
      - assuming that a user would always
        navigate through an entire collection?
      - automatically fetch new pages etc -> not the case in the list
      - is like a "lazy" list (do not even know the size of array)
    - could you allow someone to just pass a collection, but no item?
  */
});
