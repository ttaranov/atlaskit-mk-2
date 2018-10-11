// @flow
import React, { type ComponentType } from 'react';
import { TargetOverlay, TargetOuter, TargetInner } from '../styled/Target';

type Props = {
  /** Whether or not to display a pulse animation around the spotlighted element */
  pulse: boolean,
  /** The name of the SpotlightTarget */
  target?: string,
  /** The spotlight target node */
  targetNode: HTMLElement,
  /** The background color of the element being highlighted */
  targetBgColor?: string,
  /** Function to fire when a user clicks on the cloned target */
  targetOnClick?: ({ event: MouseEvent, target?: string }) => void,
  /** The border-radius of the element being highlighted */
  targetRadius?: number,
  /** Alternative element to render than the wrapped target */
  targetReplacement?: ComponentType<*>,
};

function cloneAndOverrideStyles(node: HTMLElement): HTMLElement {
  const shouldCloneChildren = true;
  const clonedNode = node.cloneNode(shouldCloneChildren);

  clonedNode.style.margin = '0';
  clonedNode.style.position = 'static';
  // The target may have other transforms applied. Avoid unintended side effects
  // by zeroing out "translate" rather than applying a value of "none".
  clonedNode.style.transform = 'translate(0, 0) translate3d(0, 0, 0)';

  return clonedNode;
}

/* eslint-disable react/prop-types, react/no-danger */
const CloneWrapper = ({ html }) => (
  <div
    dangerouslySetInnerHTML={{ __html: html }}
    style={{ pointerEvents: 'none' }}
  />
);
/* eslint-enable react/prop-types, react/no-danger */

const Clone = (props: Props) => {
  const {
    pulse,
    target,
    targetBgColor,
    targetOnClick,
    targetNode,
    targetRadius,
    targetReplacement: Replacement,
  } = props;

  if (!target && !targetNode) {
    const targetText = target ? ` matching "${target}".` : '.';
    throw Error(`Spotlight couldn't find a target${targetText}.`);
  }
  const { height, left, top, width } = targetNode.getBoundingClientRect();
  const rect = { height, left, top, width };
  console.log(rect);
  const clone = cloneAndOverrideStyles(targetNode);

  return Replacement ? (
    <Replacement {...rect} />
  ) : (
    <TargetInner
      pulse={pulse}
      bgColor={targetBgColor}
      radius={targetRadius}
      style={rect}
    >
      <CloneWrapper html={clone.outerHTML} />
      <TargetOverlay onClick={targetOnClick && this.handleTargetClick} />
    </TargetInner>
  );
};

export default Clone;
