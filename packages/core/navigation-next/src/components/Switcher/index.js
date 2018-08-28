// @flow

import React, {
  cloneElement,
  Component,
  type ComponentType,
  type Element,
} from 'react';
import { components, PopupSelect } from '@atlaskit/select';
import { colors, gridSize as gridSizeFn } from '@atlaskit/theme';
import AddIcon from '@atlaskit/icon/glyph/add';

import Option from './Option';

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

// ==============================
// Class
// ==============================

type Props = {
  /* The action and text representing a create button as the footer */
  create?: { onClick: (*) => void, text: string },
  /* Replaceable components */
  components: { [key: string]: ComponentType<*> },
  /* The options presented in the select menu */
  options: Array<Object>,
  /* The target element, which invokes the select menu */
  target: Element<*>,
};
type State = {
  isOpen: boolean,
};

export default class Switcher extends Component<Props, State> {
  state = { isOpen: false };
  static defaultProps = {
    components: { Control, Option },
  };
  handleOpen = () => {
    this.setState({ isOpen: true });
  };
  handleClose = () => {
    this.setState({ isOpen: false });
  };
  render() {
    const { create, options, target, ...props } = this.props;
    const { isOpen } = this.state;

    return (
      <PopupSelect
        filterOption={filterOption}
        isOptionSelected={isOptionSelected}
        footer={create ? <Footer {...create} /> : null}
        getOptionValue={getOptionValue}
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        options={options}
        maxMenuWidth={238}
        minMenuWidth={238}
        target={cloneElement(target, { isSelected: isOpen })}
        {...props}
      />
    );
  }
}
