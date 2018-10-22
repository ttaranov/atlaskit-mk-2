import * as React from 'react';
import { mount } from 'enzyme';
import { ProcessedFileState } from '@atlaskit/media-core';
import { BaseProps, BaseViewer } from '../../../../newgen/viewers/base-viewer';
import { createContext } from '../../_stubs';
import { Outcome } from '../../../../newgen/domain';
import { MediaViewerError } from '../../../../newgen/error';

function createItem(): ProcessedFileState {
  return {
    id: 'some-id',
    status: 'processed',
    name: 'my image',
    size: 11222,
    mediaType: 'image',
    mimeType: 'jpeg',
    artifacts: {},
  };
}

function createProps(): BaseProps {
  const item = createItem();
  const context = createContext();
  const collectionName = 'test-collection';
  return { item, context, collectionName };
}

function createInitialState() {
  return {
    content: Outcome.pending<string, MediaViewerError>(),
  };
}

function createTestViewer(props: BaseProps) {
  const initSpy = jest.fn();
  const releaseSpy = jest.fn();
  class TestViewer extends BaseViewer<string, BaseProps> {
    protected get initialState() {
      return createInitialState();
    }
    protected init = initSpy;
    protected release = releaseSpy;
    render() {
      return <div />;
    }
  }
  const el = mount(<TestViewer {...props} />);
  return { el, initSpy, releaseSpy };
}

describe('BaseViewer', () => {
  it('calls init() when component is mounted', () => {
    const { initSpy } = createTestViewer(createProps());
    expect(initSpy).toHaveBeenCalledTimes(1);
  });

  it('calls release() when component is unmounted', () => {
    const { el, releaseSpy } = createTestViewer(createProps());
    el.unmount();
    expect(releaseSpy).toHaveBeenCalledTimes(1);
  });

  it('calls release(), then init() when item was updated', () => {
    const { el, initSpy, releaseSpy } = createTestViewer(createProps());
    const newItem = { ...createItem(), id: 'new-id' };
    el.setProps({ item: newItem });
    expect(releaseSpy).toHaveBeenCalledTimes(1);
    expect(initSpy).toHaveBeenCalledTimes(2);
  });

  it('calls release(), then init() when context was updated', () => {
    const { el, initSpy, releaseSpy } = createTestViewer(createProps());
    el.setProps({ context: createContext() });
    expect(releaseSpy).toHaveBeenCalledTimes(1);
    expect(initSpy).toHaveBeenCalledTimes(2);
  });

  it('calls release(), then init() when collectionName was updated', () => {
    const { el, initSpy, releaseSpy } = createTestViewer(createProps());
    el.setProps({ collectionName: 'another-collection-name' });
    expect(releaseSpy).toHaveBeenCalledTimes(1);
    expect(initSpy).toHaveBeenCalledTimes(2);
  });

  it('sets the initialState when component is mounted', () => {
    const { el } = createTestViewer(createProps());
    expect(el.state()).toMatchObject(createInitialState());
  });

  it('resets the component to the initialState when properties were updated', () => {
    const { el } = createTestViewer(createProps());
    el.setState({ content: Outcome.successful('test') });
    el.setProps({ context: createContext() });
    expect(el.state()).toMatchObject(createInitialState());
  });
});
