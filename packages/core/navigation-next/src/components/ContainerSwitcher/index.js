// @flow

import React, { PureComponent } from 'react';
import Select, { components } from 'react-select';

import { colors, gridSize } from '@atlaskit/theme';
import ChevronDown from '@atlaskit/icon/glyph/chevron-down';
import SearchIcon from '@atlaskit/icon/glyph/editor/search';
import AddIcon from '@atlaskit/icon/glyph/editor/add';

import type { ContainerHeaderProps } from './types';
import ContainerHeader from '../ContainerHeader';

// ==============================
// Custom Functions
// ==============================

function filterOption({ data }, input) {
  return data.text.toLowerCase().includes(input.toLowerCase());
}
function isOptionSelected(option, selected) {
  return option.key === selected[0].key;
}
function getOptionValue(option) {
  return option.key;
}

// ==============================
// Custom Styles
// ==============================

const selectStyles = {
  menu: () => null, // strip ALL menu styles
};

// ==============================
// Custom Components
// ==============================

const containerHeaderModifier = (defaultStyles, state) => {
  const { isActive, isHover, isSelected } = state;
  const isResting = !isActive && !isHover && !isSelected;
  const bg = isResting ? { backgroundColor: 'transparent' } : null;

  return {
    ...defaultStyles,
    itemBase: {
      ...defaultStyles.itemBase,
      ...bg,
      paddingLeft: gridSize(),
      paddingRight: gridSize(),
      borderRadius: 0,
    },
  };
};
const Option = ({ data, innerProps, isFocused, isSelected }: *) => {
  return isSelected ? null : (
    <ContainerHeader
      styles={(defaultStyles, state) =>
        containerHeaderModifier(defaultStyles, {
          ...state,
          isHover: state.isHover || isFocused,
        })
      }
      tabIndex="-1"
      {...data}
      {...innerProps}
    />
  );
};
const DropdownIndicator = () => (
  <div css={{ width: 32 }}>
    <SearchIcon />
  </div>
);
const Control = props => (
  <div
    css={{
      boxShadow: `0 2px 0 ${colors.N40A}`,
      minWidth: 220,
      padding: gridSize(),

      // hoist the box shadow over options
      position: 'relative',
      zIndex: 1,
    }}
  >
    <components.Control {...props} />
  </div>
);

type Props = ContainerHeaderProps & {
  onChange: Object => void,
  searchThreshold: number,
  items: Array<Object>,
};
type State = { isOpen: boolean, value: Object };

function getItemCount(items) {
  let count = 0;

  items.forEach(groupOrOption => {
    if (groupOrOption.options) {
      groupOrOption.options.forEach(() => count++);
    } else {
      count++;
    }
  });

  return count;
}

export default class ContainerSwitcher extends PureComponent<Props, State> {
  state = { isOpen: false, value: this.props.items[0].options[0] };
  static defaultProps = {
    searchThreshold: 5,
  };
  toggleOpen = () => {
    this.setState(state => ({ isOpen: !state.isOpen }));
  };
  onSelectChange = (value: ContainerHeaderProps) => {
    const { onChange } = this.props;
    this.toggleOpen();
    this.setState({ value });
    if (onChange) onChange({ value });
  };
  itemCount = getItemCount(this.props.items);
  render() {
    const { items, searchThreshold } = this.props;
    const { isOpen, value } = this.state;
    const showControl = this.itemCount > searchThreshold;

    return (
      <Dropdown
        isOpen={isOpen}
        onClose={this.toggleOpen}
        target={
          <ContainerHeader
            onClick={this.toggleOpen}
            after={itemState => <ChevronDown itemState={itemState} />}
            isSelected={isOpen}
            {...value}
          />
        }
      >
        <Select
          autoFocus
          backspaceRemovesValue={false}
          classNamePrefix="project-switcher"
          components={{
            DropdownIndicator,
            Control: showControl ? Control : () => null,
            Option,
            IndicatorSeparator: null,
          }}
          controlShouldRenderValue={false}
          filterOption={filterOption}
          getOptionValue={getOptionValue}
          isClearable={false}
          isOptionSelected={isOptionSelected}
          menuIsOpen
          maxMenuHeight={showControl ? 260 : 310}
          onChange={this.onSelectChange}
          options={items}
          placeholder="Search all projects"
          styles={selectStyles}
          tabSelectsValue={false}
          value={value}
        />
        <Footer onClick={() => console.log('Create new project!')}>
          <AddIcon />
          <span css={{ marginLeft: '0.5em' }}>Create project</span>
        </Footer>
      </Dropdown>
    );
  }
}

// ==============================
// Styled Components
// ==============================

const Menu = props => {
  const shadow = colors.N40A;
  return (
    <div
      css={{
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        marginTop: gridSize(),
        minWidth: 240,
        position: 'absolute',
        zIndex: 2,
      }}
      {...props}
    />
  );
};
const Blanket = props => (
  <div
    css={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: 'fixed',
      zIndex: 1,
    }}
    {...props}
  />
);
const Dropdown = ({ children, isOpen, target, onClose }) => (
  <div css={{ position: 'relative' }}>
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </div>
);

const Footer = props => (
  <button
    css={{
      alignItems: 'center',
      background: 0,
      border: 0,
      boxShadow: `0 -2px 0 ${colors.N40A}`,
      color: 'inherit',
      cursor: 'pointer',
      display: 'flex',
      font: 'inherit',
      height: 44,
      paddingLeft: gridSize(),
      paddingRight: gridSize(),
      outline: 0,
      width: '100%',

      // hoist the box shadow over options
      position: 'relative',
      zIndex: 1,

      ':hover, :focus': {
        textDecoration: 'underline',
      },
    }}
    {...props}
  />
);
