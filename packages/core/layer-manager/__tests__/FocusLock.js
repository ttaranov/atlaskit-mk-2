// @flow
import React, { type Node } from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import { FocusLock } from '../src';

const textContent = elem => (elem ? elem.textContent : '');

const documentBody = fn => {
  if (!document.body) {
    throw new Error('expected document.body to exist');
  } else {
    fn(document.body);
  }
};

it('should focus button', () => {
  const ref = React.createRef();
  const wrapper = mount(
    <div>
      <FocusLock enabled>
        <button ref={ref}>Button 1</button>
      </FocusLock>
    </div>,
  );
  expect(textContent(document.activeElement)).toBe('Button 1');
});

it('should focus element with a function', () => {
  const ref = React.createRef();
  const wrapper = mount(
    <FocusLock enabled autoFocus={() => ref.current}>
      <div>
        <button>Button 1</button>
        <button ref={ref}>Button 2</button>
      </div>
    </FocusLock>,
  );
  expect(textContent(document.activeElement)).toBe('Button 2');
});

it('should focus in last rendered lock', () => {
  const ref = React.createRef();
  mount(
    <div>
      <FocusLock enabled>
        <button>Button 1</button>
      </FocusLock>
      <FocusLock enabled>
        <button>Button 2</button>
      </FocusLock>
      <FocusLock enabled>
        <button ref={ref}>Button 3</button>
      </FocusLock>
    </div>,
  );
  expect(textContent(document.activeElement)).toBe('Button 3');
});

it('should focus last enabled lock', () => {
  const ref = React.createRef();
  mount(
    <div>
      <FocusLock enabled>
        <button>Button 1</button>
      </FocusLock>
      <FocusLock enabled>
        <button ref={ref}>Button 2</button>
      </FocusLock>
      <FocusLock>
        <button>Button 3</button>
      </FocusLock>
    </div>,
  );
  expect(textContent(document.activeElement)).toBe('Button 2');
});

it('should focus on inner lock', () => {
  const ref = React.createRef();
  mount(
    <FocusLock enabled>
      <button>Button 1</button>
      <FocusLock enabled>
        <button ref={ref}>Button 2</button>
      </FocusLock>
    </FocusLock>,
  );
  expect(textContent(document.activeElement)).toBe('Button 2');
});

it('should focus on last enabled inner lock', () => {
  const ref = React.createRef();
  mount(
    <div>
      <FocusLock enabled>
        <div>
          <button>Button 1</button>
          <FocusLock enabled>
            <div>
              <button ref={ref}>Button 2</button>
              <FocusLock>
                <button>Button 3</button>
              </FocusLock>
            </div>
          </FocusLock>
        </div>
      </FocusLock>
    </div>,
  );
  expect(textContent(document.activeElement)).toBe('Button 2');
});

it('should work through Portals', () => {
  const ref = React.createRef();
  class Portal extends React.Component<{ children: Node }> {
    domNode = document.createElement('div');
    constructor(props) {
      super(props);
      documentBody(body => body.appendChild(this.domNode));
    }
    componentWillUnmount() {
      documentBody(body => body.removeChild(this.domNode));
    }
    render() {
      return ReactDOM.createPortal(this.props.children, this.domNode);
    }
  }
  mount(
    <div>
      <Portal>
        <FocusLock enabled>
          <button>Button 1</button>
        </FocusLock>
      </Portal>
      <Portal>
        <FocusLock enabled>
          <button>Button 2</button>
        </FocusLock>
      </Portal>
      <Portal>
        <FocusLock enabled>
          <button ref={ref}>Button 3</button>
        </FocusLock>
      </Portal>
    </div>,
  );
  expect(textContent(document.activeElement)).toBe('Button 3');
});
