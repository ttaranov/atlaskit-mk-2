// @flow

import React, { type Node } from 'react';
import { layers } from '@atlaskit/theme';
import ScrollLock from 'react-scrolllock';
import { Popper, Manager, Reference } from '@atlaskit/popper';

type Props = {
  /** A ref to the container that the content should be layered around for height calculation
   * purposes. This must be an ancestor element as component does not attach the layered content around
   * the ref itself. */
  containerRef: ?HTMLElement,
  /**
   * The content to render in the layer.
   */
  content: Node,
};

/**
 * This component renders layered content with fixed positioning.
 * Scroll is locked outside the layer to prevent the layered content from detaching from the
 * container ref.
 *
 * TODO: Fix a bug in layer/popper.js where auto flip isn't occuring when it should because of vertical scroll distance incorrectly
 * making the library think the component is further up the page than it is.
 */
const FixedLayer = ({ containerRef, content }: Props) => {
  if (!containerRef) {
    // Wait for containerRef callback to cause a re-render
    return <div />;
  }
  const containerRect = containerRef.getBoundingClientRect();
  return (
    /* Need to wrap layer in a fixed position div so that it will render its content as fixed
     * We need to set the intial top value to where the container is and zIndex so that it still
     * applies since we're creating a new stacking context. */
    <Manager>
      <ScrollLock />
      <Reference>
        {({ ref }) => (
          <div
            ref={ref}
            data-layer-child
            style={{
              position: 'absolute',
              top: 0,
              height: containerRect.height,
              width: containerRect.width,
              background: 'transparent',
            }}
          />
        )}
      </Reference>
      <Popper>
        {({ ref, style, placement }) => {
          return (
            <div
              ref={ref}
              style={{
                ...style,
                zIndex: layers.dialog(),
              }}
              placement={placement}
            >
              {content}
            </div>
          );
        }}
      </Popper>
    </Manager>
  );
};

export default FixedLayer;
