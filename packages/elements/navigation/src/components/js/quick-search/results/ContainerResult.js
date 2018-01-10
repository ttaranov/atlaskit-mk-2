import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Avatar from '@atlaskit/avatar';

import ResultBase from './ResultBase';

const CONTAINER_RESULT_TYPE = 'container';

// ===================================================================
// If adding a prop or feature that may be useful to all result types,
// add it to ResultBase instead
// ===================================================================

/**
 * Generic result type for Atlassian containers.
 */
export default class ContainerResult extends PureComponent {
  static propTypes = {
    /** Src URL of the image to be used as the result's icon */
    avatarUrl: PropTypes.string,
    /** Text to appear to the right of the `name`. It has a lower font-weight. */
    caption: PropTypes.string,
    /** Content to be shown after the main content. Shown to the right of content
    (or to the left in RTL mode). */
    elemAfter: PropTypes.node,
    /** Location to link out to on click. */
    href: PropTypes.string,
    /** Reduces padding and font size. */
    isCompact: PropTypes.bool,
    /** Set whether to display a lock on the result's icon */
    isPrivate: PropTypes.bool,
    /** Set whether the item should be highlighted as selected. Selected items have
    a different background color. */
    isSelected: PropTypes.bool,
    /** Name of the container. Provides the main text to be displayed as the item. */
    name: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    /** Triggered by mouseClick event. Called with { `resultId`,  `type` }. */
    onClick: PropTypes.func,
    /** Triggered by mouseEnter event. Called with { `resultId`,  `type` }. */
    onMouseEnter: PropTypes.func,
    /** Standard onMouseLeave event. */
    onMouseLeave: PropTypes.func,
    /** Unique ID of the result. This is passed as a parameter to certain callbacks */
    resultId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** Text to be shown alongside the main `name` text. */
    subText: PropTypes.string,
    /** Type of the result. This is passed as a parameter to certain callbacks. */
    type: PropTypes.string,
  }

  static defaultProps = {
    isSelected: false,
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    type: CONTAINER_RESULT_TYPE,
  }

  getAvatar = () => (
    <Avatar
      src={this.props.avatarUrl}
      appearance="square"
      status={this.props.isPrivate ? 'locked' : null}
    />
  )

  render() {
    const {
      name,
      ...resultBaseProps
    } = this.props;
    return (
      <ResultBase
        {...resultBaseProps}
        icon={this.getAvatar()}
        text={name}
      />
    );
  }
}
