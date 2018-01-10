import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { QS_ANALYTICS_EV_SUBMIT } from '../constants';
import AkNavigationItem from '../../NavigationItem';

const BASE_RESULT_TYPE = 'base';

const noOp = () => {};

// ==========================================================================================
// This class enforces a standard set of props and behaviour for all result types to support.
// All "-Result" components (PersonResult, ContainerResult, ObjectResult, etc.) should extend
// this class to ensure consideration of these props.
// ==========================================================================================

export default class ResultBase extends PureComponent {
  static propTypes = {
    /** Data to be sent with analytics events */
    analyticsData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    /** Text to appear to the right of the text. It has a lower font-weight. */
    caption: PropTypes.string,
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
    /** Triggered by mouseClick event. Called with { `resultId`,  `type` }. */
    onClick: PropTypes.func,
    /** Triggered by mouseEnter event. Called with { `resultId`,  `type` }. */
    onMouseEnter: PropTypes.func,
    /** Standard onMouseLeave event. */
    onMouseLeave: PropTypes.func,
    /** Unique ID of the result. This is passed as a parameter to certain callbacks */
    resultId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** Text to be shown alongside the main `text`. */
    subText: PropTypes.string,
    /** Main text to be displayed as the item. */
    text: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    /** Type of the result. This is passed as a parameter to certain callbacks. */
    type: PropTypes.string,

    /** Fires an analytics event */
    sendAnalytics: PropTypes.func,
  }

  static defaultProps = {
    isCompact: false,
    isSelected: false,
    isTabbingDisabled: false,
    onClick: noOp,
    onMouseEnter: noOp,
    onMouseLeave: noOp,
    sendAnalytics: noOp,
    type: BASE_RESULT_TYPE,
  }

  handleClick = () => {
    const { analyticsData, onClick, resultId, sendAnalytics, type } = this.props;
    sendAnalytics(
      QS_ANALYTICS_EV_SUBMIT,
      {
        ...analyticsData,
        method: 'click',
        type,
      }
    );
    onClick({ resultId, type });
  }

  handleMouseEnter = () => this.props.onMouseEnter({
    resultId: this.props.resultId,
    type: this.props.type,
  });

  render() {
    const {
      caption,
      elemAfter,
      href,
      icon,
      isCompact,
      isSelected,
      onMouseLeave,
      subText,
      text,
    } = this.props;
    return (
      <AkNavigationItem
        caption={caption}
        href={href}
        icon={icon}
        isCompact={isCompact}
        isSelected={isSelected}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={onMouseLeave}
        subText={subText}
        text={text}
        textAfter={elemAfter}
      />
    );
  }
}
