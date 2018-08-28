// @flow
import React from 'react';
import { mount } from 'enzyme';
import Blanket from '@atlaskit/blanket';

import ModalDialog, { ModalTransition } from '../../..';
import { Positioner } from '../../Modal';
import Content from '../../Content';
import Header from '../../Header';
import Footer from '../../Footer';
import { dialogHeight, dialogWidth, Dialog } from '../../../styled/Modal';

jest.mock('raf-schd', () => fn => fn);

// dialogs require an onClose function
const noop = () => {};

const MyContent = () => <div>Hello</div>;

test('should render a modal dialog with content', () => {
  const wrapper = mount(
    <ModalTransition>
      <ModalDialog onClose={noop}>
        <MyContent />
      </ModalDialog>
    </ModalTransition>,
  );
  expect(wrapper.find(Content)).toHaveLength(1);
});

describe('modal-dialog', () => {
  describe('props', () => {
    describe('height', () => {
      it('should be passed to Dialog', () => {
        const wrapper = mount(<ModalDialog onClose={noop} height="42%" />);
        const dialogHeightProp = wrapper.find(Dialog).prop('heightValue');
        expect(dialogHeightProp).toBe('42%');
      });

      it('should return px if number', () => {
        expect(dialogHeight({ heightValue: 42 })).toBe('42px');
      });

      it('should return raw value if string', () => {
        expect(dialogHeight({ heightValue: '42%' })).toBe('42%');
        expect(dialogHeight({ heightValue: '42em' })).toBe('42em');
        expect(dialogHeight({ heightValue: 'initial' })).toBe('initial');
      });

      it('should return "auto" if not supplied', () => {
        expect(dialogHeight({})).toBe('auto');
      });
    });
    describe('width', () => {
      const TSHIRT_SIZES = ['small', 'medium', 'large', 'x-large'];

      it('should return px if number', () => {
        expect(dialogWidth({ widthValue: 42 })).toBe('42px');
      });

      it('should return raw value if string', () => {
        expect(dialogWidth({ widthValue: '42%' })).toBe('42%');
        expect(dialogWidth({ widthValue: '42em' })).toBe('42em');
        expect(dialogWidth({ widthValue: 'auto' })).toBe('auto');
      });

      it('should return "auto" if not supplied', () => {
        expect(dialogWidth({})).toBe('auto');
      });

      TSHIRT_SIZES.forEach(width => {
        it(`width = "${width}" is applied uniquely`, () => {
          const wrapper = mount(<ModalDialog width={width} onClose={noop} />);
          const widthProp = wrapper.find(Positioner).prop('widthName');
          expect(widthProp).toEqual(width);
        });
      });
    });

    describe('header', () => {
      it('should render when set', () => {
        const node = <span>My header</span>;
        const wrapper = mount(
          <ModalDialog header={() => node} onClose={noop} />,
        );
        expect(wrapper.contains(node)).toBe(true);
      });
    });

    describe('footer', () => {
      it('should render when set', () => {
        const node = <span>My footer</span>;
        const wrapper = mount(
          <ModalDialog footer={() => node} onClose={noop} />,
        );

        expect(wrapper.contains(node)).toBe(true);
      });
    });

    describe('children', () => {
      it('should render when set', () => {
        const node = (
          <form>
            This is <strong>my</strong> form
          </form>
        );
        const wrapper = mount(<ModalDialog onClose={noop}>{node}</ModalDialog>);

        expect(wrapper.contains(node)).toBe(true);
      });
    });

    describe('onClose', () => {
      it('should trigger when blanket clicked', () => {
        const spy = jest.fn();
        const wrapper = mount(<ModalDialog onClose={spy} />);

        const blanket = wrapper.find(Blanket);

        blanket.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should trigger when blanket clicked below dialog (modalPositioner)', () => {
        const spy = jest.fn();
        const wrapper = mount(<ModalDialog onClose={spy} />);

        wrapper.find(Positioner).simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should not trigger when blanket content clicked', () => {
        const spy = jest.fn();
        const wrapper = mount(
          <ModalDialog onClose={spy}>
            <MyContent />
          </ModalDialog>,
        );

        wrapper.find(MyContent).simulate('click');
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe('scrolling header/footer keylines', () => {
    it('should enable header keyline only when header provided', () => {
      const CustomBody = ({ innerRef }: { innerRef: Function }) => {
        innerRef({
          addEventListener: jest.fn(),
          clientHeight: 200,
          scrollHeight: 100,
          scrollTop: 10,
        });
        return <div />;
      };
      const wrapper = mount(<ModalDialog onClose={noop} body={CustomBody} />);

      const header = wrapper.find(Header);
      expect(header.prop('showKeyline')).toEqual(true);
    });

    it('should enable footer keyline only when footer provided', () => {
      const CustomBody = ({ innerRef }: { innerRef: Function }) => {
        innerRef({
          addEventListener: jest.fn(),
          clientHeight: 100,
          scrollHeight: 200,
          scrollTop: 0,
        });
        return <div />;
      };
      const wrapper = mount(<ModalDialog onClose={noop} body={CustomBody} />);

      const header = wrapper.find(Footer);
      expect(header.prop('showKeyline')).toEqual(true);
    });
  });

  describe('chromeless', () => {
    it('header should not render if dialog is chromeless', () => {
      const MyHeader = () => <span>My header</span>;
      const wrapper = mount(
        <ModalDialog isChromeless header={MyHeader} onClose={noop} />,
      );

      expect(wrapper.contains(MyHeader)).toBe(false);
    });

    it('footer should not render if dialog is chromeless', () => {
      const MyFooter = () => <span>My footer</span>;
      const wrapper = mount(
        <ModalDialog isChromeless footer={MyFooter} onClose={noop} />,
      );

      expect(wrapper.contains(MyFooter)).toBe(false);
    });
  });
});

test('multiple modals should stack on one another', () => {
  const wrapper = mount(
    <div>
      <ModalDialog>back</ModalDialog>
      <ModalDialog>middle</ModalDialog>
      <ModalDialog>front</ModalDialog>
    </div>,
  );
  const indexes = wrapper
    .find(Content)
    .map(content => content.prop('stackIndex'));
  expect(indexes).toEqual([2, 1, 0]);
});

test('nested modals should stack on one another', () => {
  const wrapper = mount(
    <div>
      <ModalDialog>back</ModalDialog>
      <ModalDialog>
        middle
        <ModalDialog>front</ModalDialog>
      </ModalDialog>
    </div>,
  );
  const indexes = wrapper
    .find(Content)
    .map(content => content.prop('stackIndex'));
  expect(indexes).toEqual([2, 1, 0]);
});

test('multiple modals update stack on unmount', () => {
  class Wrapper extends React.Component<{}, { open: boolean }> {
    state = { open: true };
    render() {
      return (
        <div>
          <ModalDialog />
          <ModalDialog />
          {this.state.open && (
            <ModalDialog>
              <button onClick={() => this.setState({ open: false })}>
                close
              </button>
            </ModalDialog>
          )}
        </div>
      );
    }
  }
  const wrapper = mount(<Wrapper />);
  wrapper.find('button').simulate('click');
  const indexes = wrapper
    .find(Content)
    .map(content => content.prop('stackIndex'));
  expect(indexes).toEqual([1, 0]);
});

test('can manually override modals stack', () => {
  const wrapper = mount(
    <div>
      <ModalDialog>back</ModalDialog>
      <ModalDialog stackIndex={1}>front</ModalDialog>
    </div>,
  );
  const indexes = wrapper
    .find(Content)
    .map(content => content.prop('stackIndex'));
  expect(indexes).toEqual([1, 1]);
});

// beautiful-dnd will miscalculate positions if the container has a transform applied to it.
test('no transform is applied to content', () => {
  jest.useFakeTimers();
  const wrapper = mount(<ModalDialog />);
  jest.runAllTimers();
  // update enzyme's view of component tree after animations have finished
  wrapper.update();
  const style = wrapper.find(Positioner).prop('style');
  expect(style.transform).toEqual(null);
});

describe('ModalDialog', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<ModalDialog onClose={noop} />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
