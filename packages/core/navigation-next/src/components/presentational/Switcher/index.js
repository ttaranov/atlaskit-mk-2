// @flow

import React, { cloneElement, PureComponent } from 'react';
import NodeResolver from 'react-node-resolver';
import shallowEqualObjects from 'shallow-equal/objects';
import { components, PopupSelect } from '@atlaskit/select';
import { colors, gridSize as gridSizeFn } from '@atlaskit/theme';
import AddIcon from '@atlaskit/icon/glyph/add';

import Option from './Option';
import { UIControllerSubscriber } from '../../../ui-controller';
import { CONTENT_NAV_WIDTH } from '../../../common/constants';
import type { SwitcherProps, SwitcherState } from './types';

const gridSize = gridSizeFn();

// ==============================
// Custom Functions
// ==============================

function filterOption({ data }, input) {
  return data.text.toLowerCase().includes(input.toLowerCase());
}
function isOptionSelected(option, selected) {
  if (!selected || !selected.length) return false;
  return option.id === selected[0].id;
}
function getOptionValue(option) {
  return option.id;
}

// ==============================
// Custom Components
// ==============================

const Control = ({ innerProps: { innerRef, ...innerProps }, ...props }: *) => (
  <div
    ref={innerRef}
    css={{
      boxShadow: `0 2px 0 ${colors.N40A}`,
      padding: gridSize,
      position: 'relative',
    }}
  >
    <components.Control {...props} innerProps={innerProps} />
  </div>
);
const Footer = ({ text, onClick }: *) => (
  <button
    css={{
      background: 0,
      border: 0,
      boxShadow: `0 -2px 0 ${colors.N40A}`,
      boxSizing: 'border-box',
      color: colors.N200,
      cursor: 'pointer',
      alignItems: 'center',
      display: 'flex',
      fontSize: 'inherit',
      padding: `${gridSize * 1.5}px ${gridSize}px`,
      position: 'relative',
      textAlign: 'left',
      width: '100%',

      ':hover, :focus': {
        color: colors.B300,
        outline: 0,
        textDecoration: 'underline',
      },
    }}
    onClick={onClick}
  >
    <AddIcon label="Add icon" size="small" />
    <span css={{ marginLeft: gridSize }}>{text}</span>
  </button>
);

const defaultComponents = { Control, Option };

const isEmpty = obj => Object.keys(obj).length === 0;

// ==============================
// Class
// ==============================

// internal `navWidth` property isn't part of the public API
type SwitcherPropsExtended = SwitcherProps & { navWidth: number };

class Switcher extends PureComponent<SwitcherPropsExtended, SwitcherState> {
  state = {
    isOpen: false,
    mergedComponents: defaultComponents,
  };
  selectRef = React.createRef();
  targetRef: Element;
  targetWidth = 0;
  static defaultProps = {
    closeMenuOnCreate: true,
    components: {},
  };
  static getDerivedStateFromProps(
    props: SwitcherPropsExtended,
    state: SwitcherState,
  ) {
    const newState = {};

    // Merge consumer and default components
    const mergedComponents = { ...defaultComponents, ...props.components };
    if (!shallowEqualObjects(mergedComponents, state.mergedComponents)) {
      newState.mergedComponents = mergedComponents;
    }

    if (!isEmpty(newState)) return newState;

    return null;
  }
  componentDidMount() {
    this.setTargetWidth();
  }
  componentDidUpdate({ navWidth }: SwitcherPropsExtended) {
    // reset the target width if the user has resized the navigation pane
    if (navWidth !== this.props.navWidth) {
      this.setTargetWidth();
    }
  }
  getTargetRef = ref => {
    this.targetRef = ref;
  };
  setTargetWidth = () => {
    // best efforts if target ref fails
    const defaultWidth = CONTENT_NAV_WIDTH - gridSize * 2;

    this.targetWidth = this.targetRef
      ? this.targetRef.clientWidth
      : defaultWidth;
  };
  handleOpen = () => {
    this.setState({ isOpen: true });
  };
  handleClose = () => {
    this.setState({ isOpen: false });
  };
  getFooter = () => {
    const { closeMenuOnCreate, create, footer } = this.props;

    if (footer) return footer;
    if (!create) return null;

    let onClick = create.onClick;
    if (closeMenuOnCreate) {
      onClick = e => {
        if (this.selectRef.current) {
          this.selectRef.current.close();
        }
        create.onClick(e);
      };
    }

    return <Footer text={create.text} onClick={onClick} />;
  };
  render() {
    const { create, options, target, ...props } = this.props;
    const { isOpen, mergedComponents } = this.state;

    return (
      <PopupSelect
        ref={this.selectRef}
        filterOption={filterOption}
        isOptionSelected={isOptionSelected}
        footer={this.getFooter()}
        getOptionValue={getOptionValue}
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        options={options}
        maxMenuWidth={this.targetWidth}
        minMenuWidth={this.targetWidth}
        target={
          <NodeResolver innerRef={this.getTargetRef}>
            {cloneElement(target, { isSelected: isOpen })}
          </NodeResolver>
        }
        {...props}
        components={mergedComponents}
      />
    );
  }
}

export default (props: SwitcherProps) => (
  <UIControllerSubscriber>
    {({ state }) => <Switcher navWidth={state.productNavWidth} {...props} />}
  </UIControllerSubscriber>
);
