import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Avatar from '@atlaskit/avatar';

import ResultBase from './ResultBase';

const PERSON_RESULT_TYPE = 'person';

// ===================================================================
// If adding a prop or feature that may be useful to all result types,
// add it to ResultBase instead
// ===================================================================

export default class PersonResult extends PureComponent {
  static propTypes = {
    /** Src URL of the image to be used as the result's icon */
    avatarUrl: PropTypes.string,
    /** Content to be shown after the main content. Shown to the right of content
    (or to the left in RTL mode). */
    elemAfter: PropTypes.node,
    /** Location to link out to on click. */
    href: PropTypes.string,
    /** React element to appear to the left of the text. */
    icon: PropTypes.node,
    /** Reduces padding and font size. */
    isCompact: PropTypes.bool,
    /** Set whether the item should be highlighted as selected. Selected items have
    a different background color. */
    isSelected: PropTypes.bool,
    /** A user's custom handle. Appears to the right of their `name`. It has a lower
    font-weight. */
    mentionName: PropTypes.string,
    /** A character with which to prefix the `mentionName`. Defaults to '@' */
    mentionPrefix: PropTypes.string,
    /** Name of the container. Provides the main text to be displayed as the item. */
    name: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    /** Triggered by mouseClick event. Called with { `resultId`, `type` }. */
    onClick: PropTypes.func,
    /** Triggered by mouseEnter event. Called with { `resultId`,  `type` }. */
    onMouseEnter: PropTypes.func,
    /** Standard onMouseLeave event. */
    onMouseLeave: PropTypes.func,
    /** Text to be shown alongside the main `text`. */
    presenceMessage: PropTypes.string,
    /** Sets the appearance of the presence indicator */
    presenceState: PropTypes.oneOf(['online', 'busy', 'offline']),
    /** Unique ID of the result. This is passed as a parameter to certain callbacks */
    resultId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** Type of the result. This is passed as a parameter to certain callbacks. */
    type: PropTypes.string,
  }

  static defaultProps = {
    isSelected: false,
    mentionPrefix: '@',
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    type: PERSON_RESULT_TYPE,
    presenceState: null, // No presence indicator by default
  };

  getMention = () => (
    this.props.mentionName
      ? `${this.props.mentionPrefix}${this.props.mentionName}`
      : null
  );

  getAvatar = () => (
    <Avatar
      presence={this.props.presenceState}
      src={this.props.avatarUrl}
    />
  );

  render() {
    const {
      name,
      presenceMessage,
      ...resultBaseProps
    } = this.props;
    return (
      <ResultBase
        {...resultBaseProps}
        caption={this.getMention()}
        icon={this.getAvatar()}
        subText={presenceMessage}
        text={name}
      />
    );
  }
}
