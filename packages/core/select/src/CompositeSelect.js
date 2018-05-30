// @flow

import React, {
  PureComponent,
  type ElementRef,
  type Element,
  type Node,
} from 'react';
import { createPortal } from 'react-dom';
import createFocusTrap from 'focus-trap';
import { Manager, Reference, Popper } from 'react-popper';
import NodeResolver from 'react-node-resolver';
import Select, { components as defaultComponents } from 'react-select';

import { colors } from '@atlaskit/theme';
import SearchIcon from '@atlaskit/icon/glyph/editor/search';

// Styled Components
// ==============================

type MenuProps = { maxWidth: number, minWidth: number };

const Menu = ({ maxWidth, minWidth, ...props }: MenuProps) => {
  const shadow = colors.N40A;
  return (
    <div
      css={{
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        maxWidth,
        minWidth,
        zIndex: 2,
      }}
      {...props}
    />
  );
};

// Custom Components
// ==============================

const DropdownIndicator = () => (
  <div css={{ marginRight: 2, textAlign: 'center', width: 32 }}>
    <SearchIcon />
  </div>
);
const Control = (props: *) => (
  <div css={{ padding: '8px 8px 4px' }}>
    <defaultComponents.Control {...props} />
  </div>
);
const DummyControl = props => (
  <div
    css={{
      border: 0,
      clip: 'rect(1px, 1px, 1px, 1px)',
      height: 1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: 1,
    }}
  >
    <defaultComponents.Control {...props} />
  </div>
);

type Props = {
  components: Object,
  footer?: Node,
  menuOffset: number,
  menuPlacement: string,
  minMenuWidth: number,
  maxMenuWidth: number,
  onChange?: Object => void,
  options: Array<Object>,
  searchThreshold: number,
  styles: Object,
  target: Element<*>,
};
type State = { isOpen: boolean };

export default class CompositeSelect extends PureComponent<Props, State> {
  state = { isOpen: false };
  menuRef: HTMLElement;
  targetRef: HTMLElement;
  selectRef: ElementRef<*>;
  focusTrap: Object;
  static defaultProps = {
    components: { Control, DropdownIndicator },
    menuOffset: 8,
    maxMenuWidth: 440,
    minMenuWidth: 220,
    menuPlacement: 'bottom-start',
    searchThreshold: 5,
    styles: { menu: () => null },
  };
  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
  }

  // Event Handlers
  // ==============================

  handleKeyDown = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'Escape':
        this.close();
        break;
      default:
    }
  };
  handleClick = ({ target }: MouseEvent) => {
    const { isOpen } = this.state;

    // appease flow
    if (!(target instanceof HTMLElement)) return;

    // NOTE: Why not use the <Blanket /> component to close?
    // We don't want to interupt the user's flow. Taking this approach allows
    // user to click "through" to other elements and close the popout.
    if (isOpen && !this.menuRef.contains(target)) {
      this.close();
    }

    // open on target click -- we can't trust consumers to spread the onClick
    // property to the target
    if (!isOpen && this.targetRef.contains(target)) {
      this.open();
    }
  };
  handleSelectChange = (value: Object) => {
    const { onChange } = this.props;
    this.close();
    if (onChange) onChange({ value });
  };

  // Internal Lifecycle
  // ==============================

  open = () => {
    this.setState({ isOpen: true }, this.initialiseFocusTrap);
    this.selectRef.select.focusOption('first'); // HACK
    window.addEventListener('keydown', this.handleKeyDown);
  };
  initialiseFocusTrap = () => {
    const trapConfig = {
      clickOutsideDeactivates: true,
      escapeDeactivates: true,
      fallbackFocus: this.menuRef,
      returnFocusOnDeactivate: true,
    };
    this.focusTrap = createFocusTrap(this.menuRef, trapConfig);
    this.focusTrap.activate();
  };
  close = () => {
    this.setState({ isOpen: false });
    this.focusTrap.deactivate();
    window.removeEventListener('keydown', this.handleKeyDown);
  };

  // Refs
  // ==============================

  resolveTargetRef = (popperRef: ElementRef<*>) => (ref: HTMLElement) => {
    this.targetRef = ref;
    popperRef(ref);
  };
  resolveMenuRef = (popperRef: ElementRef<*>) => (ref: HTMLElement) => {
    this.menuRef = ref;
    popperRef(ref);
  };
  getSelectRef = (ref: ElementRef<*>) => {
    this.selectRef = ref;
  };

  // Utils
  // ==============================

  // account for groups when counting options
  // this may need to be recursive, right now it just counts one level
  getItemCount = () => {
    const { options } = this.props;
    let count = 0;

    options.forEach(groupOrOption => {
      if (groupOrOption.options) {
        groupOrOption.options.forEach(() => count++);
      } else {
        count++;
      }
    });

    return count;
  };

  // if the threshold is exceeded display the search control
  showSearchControl = () => {
    const { searchThreshold } = this.props;
    return this.getItemCount() > searchThreshold;
  };

  // Renderers
  // ==============================

  renderSelect = () => {
    const {
      components,
      footer,
      maxMenuWidth,
      minMenuWidth,
      menuOffset,
      menuPlacement,
      options,
      target,
      ...props
    } = this.props;
    const { isOpen } = this.state;
    const showSearchControl = this.showSearchControl();
    const portalDestination = document.body;

    if (!portalDestination || !isOpen) return null;

    return createPortal(
      <Popper
        placement={menuPlacement}
        modifiers={{ offset: { offset: `0, ${menuOffset}` } }}
      >
        {({ placement, ref, style }) => {
          return (
            <NodeResolver innerRef={this.resolveMenuRef(ref)}>
              <Menu
                style={style}
                data-placement={placement}
                minWidth={minMenuWidth}
                maxWidth={maxMenuWidth}
              >
                <Select
                  backspaceRemovesValue={false}
                  classNamePrefix="project-switcher"
                  components={{
                    ...components,
                    Control: showSearchControl
                      ? components.Control
                      : DummyControl,
                  }}
                  controlShouldRenderValue={false}
                  isClearable={false}
                  menuIsOpen
                  maxMenuHeight={showSearchControl ? 260 : 310}
                  onChange={this.handleSelectChange}
                  options={options}
                  ref={this.getSelectRef}
                  tabSelectsValue={false}
                  {...props}
                />
                {footer}
              </Menu>
            </NodeResolver>
          );
        }}
      </Popper>,
      portalDestination,
    );
  };

  render() {
    const { target } = this.props;

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <NodeResolver innerRef={this.resolveTargetRef(ref)}>
              {target}
            </NodeResolver>
          )}
        </Reference>
        {this.renderSelect()}
      </Manager>
    );
  }
}
