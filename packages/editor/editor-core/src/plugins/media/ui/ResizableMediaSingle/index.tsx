import * as React from 'react';
import {
  akEditorWideLayoutWidth,
  MediaSingleResizeModes,
  MediaSingleWidthModes,
  calcPxFromColumns,
  calcPctFromPx,
  calcPxFromPct,
  calcMediaSingleWidth,
} from '@atlaskit/editor-common';

import { MediaSingleLayout } from '@atlaskit/editor-common';
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';
import { Wrapper } from './styled';
import { Props, EnabledHandles } from './types';
import Resizer, { handleSides } from './Resizer';
export default class ResizableMediaSingle extends React.Component<
  Props,
  { selected: boolean }
> {
  state = {
    selected: false,
  };

  get wrappedLayout() {
    const { layout } = this.props;
    return layout === 'wrap-left' || layout === 'wrap-right';
  }

  calcNewSize = (newWidth: number, stop: boolean) => {
    const { layout } = this.props;

    const maxWidth = calcPxFromColumns(6, this.props.lineLength, 6);
    const newPct = calcPctFromPx(newWidth, this.props.lineLength) * 100;
    if (newWidth <= maxWidth) {
      let newLayout: MediaSingleLayout;
      if (this.wrappedLayout && (stop ? newPct !== 100 : true)) {
        newLayout = layout;
      } else {
        newLayout = 'center';
      }

      return {
        width: newPct,
        layout: newLayout,
      };
    } else {
      // wide or full-width
      const newLayout: MediaSingleLayout =
        newWidth <= akEditorWideLayoutWidth ? 'wide' : 'full-width';

      return {
        width: this.props.pctWidth || null,
        layout: newLayout,
      };
    }
  };

  get gridBase() {
    const { gridSize } = this.props;
    return this.wrappedLayout || this.insideInlineLike
      ? gridSize
      : gridSize / 2;
  }

  get $pos() {
    const pos = this.props.getPos();
    if (!!!pos) {
      return null;
    }

    return this.props.state.doc.resolve(pos);
  }

  get gridSpan() {
    const { gridSize } = this.props;
    const $pos = this.$pos;
    if (!$pos) {
      return gridSize;
    }

    if (this.wrappedLayout) {
      return gridSize - 1;
    }

    return gridSize;
  }

  /**
   * The maxmimum number of grid columns this node can resize to.
   */
  get gridWidth() {
    return this.wrappedLayout || this.insideInlineLike
      ? this.gridSpan
      : this.gridSpan / 2;
  }

  wrapper: HTMLElement | null;
  get snapPoints() {
    let offsetLeft = 0;
    if (this.wrapper && this.insideInlineLike) {
      let currentNode: HTMLElement | null = this.wrapper;
      while (
        currentNode &&
        currentNode.parentElement &&
        !currentNode.parentElement.classList.contains('ProseMirror') &&
        currentNode !== document.body
      ) {
        offsetLeft += currentNode.offsetLeft;
        currentNode = currentNode.parentElement;
      }

      offsetLeft -= (document.querySelector('.ProseMirror')! as HTMLElement)
        .offsetLeft;
    }

    const { containerWidth, lineLength, appearance } = this.props;
    const snapTargets: number[] = [];
    for (let i = this.wrappedLayout ? 2 : 1; i < this.gridWidth; i++) {
      snapTargets.push(
        calcPxFromColumns(i, lineLength, this.gridBase) - offsetLeft,
      );
    }

    // full width
    snapTargets.push(
      calcPxFromColumns(this.gridBase, lineLength, this.gridBase) - offsetLeft,
    );

    const minimumWidth = calcPxFromColumns(2, lineLength, 12);
    const snapPoints = snapTargets.filter(width => width >= minimumWidth);

    const $pos = this.$pos;
    if (!$pos) {
      return snapPoints;
    }

    const isTopLevel = $pos.parent.type.name === 'doc';
    if (isTopLevel && appearance === 'full-page') {
      snapPoints.push(akEditorWideLayoutWidth);
      snapPoints.push(containerWidth - 128);
    }

    return snapPoints;
  }

  get insideInlineLike(): boolean {
    const $pos = this.$pos;
    if (!$pos) {
      return false;
    }

    const { table, listItem } = this.props.state.schema.nodes;
    return !!findParentNodeOfTypeClosestToPos($pos, [table, listItem]);
  }

  render() {
    let width = this.props.width;
    let height = this.props.height;
    const usePctWidth =
      this.props.pctWidth &&
      MediaSingleWidthModes.indexOf(this.props.layout) > -1;
    if (usePctWidth && this.props.pctWidth && width && height) {
      const pxWidth = Math.ceil(
        calcPxFromPct(
          this.props.pctWidth / 100,
          this.props.lineLength || this.props.containerWidth,
        ),
      );

      // scale, keeping aspect ratio
      height = height / width * pxWidth;
      width = pxWidth;
    }

    const enable: EnabledHandles = {};
    handleSides.forEach(side => {
      const oppositeSide = side === 'left' ? 'right' : 'left';
      enable[side] =
        MediaSingleResizeModes.concat(
          `wrap-${oppositeSide}` as MediaSingleLayout,
        ).indexOf(this.props.layout) > -1;

      if (side === 'left' && this.insideInlineLike) {
        enable[side] = false;
      }
    });

    return (
      <Wrapper
        width={width}
        height={height}
        layout={this.props.layout}
        containerWidth={this.props.containerWidth || this.props.width}
        pctWidth={usePctWidth ? this.props.pctWidth : undefined}
        innerRef={elem => (this.wrapper = elem)}
      >
        <Resizer
          {...this.props}
          mediaSingleWidth={
            this.props.layout === 'wide' || this.props.layout === 'full-width'
              ? calcMediaSingleWidth(
                  this.props.layout,
                  width,
                  this.props.containerWidth,
                )
              : width
                ? width
                : undefined
          }
          height={height}
          selected={this.state.selected}
          enable={enable}
          calcNewSize={this.calcNewSize}
          snapPoints={this.snapPoints}
          scaleFactor={!this.wrappedLayout && !this.insideInlineLike ? 2 : 1}
        >
          {React.cloneElement(React.Children.only(this.props.children), {
            onSelection: selected => {
              this.setState({ selected });
            },
          })}
        </Resizer>
      </Wrapper>
    );
  }
}
