import Column from './column';
import { findNextFreeCol, makeColIdxPair, ColIdxPair } from './utils';

export default class ResizeState {
  cols: Column[];
  maxSize: number;
  breakout?: boolean;
  freeColFunc?: any;

  constructor(
    cols: Column[],
    maxSize: number,
    breakout: boolean = false,
    freeColFunc: (
      colIdxObj: Array<ColIdxPair>,
      direction: number,
    ) => number | null = findNextFreeCol,
  ) {
    this.cols = cols;
    this.maxSize = maxSize;
    this.breakout = breakout;
    this.freeColFunc = freeColFunc;
    return Object.freeze(this);
  }

  grow(colIdx: number, amount: number) {
    let state: ResizeState = this;

    if (!state.cols[colIdx + 1]) {
      state = new ResizeState(state.cols, state.maxSize, true);
    }

    if (amount && state.cols[colIdx + 1]) {
      // if we couldn't naturally resize and we're growing this one,
      // directly shrink the adjacent one with the remaining width
      const res = state.moveSpaceFrom(state, colIdx + 1, colIdx, amount, false);

      state = res.state;
      amount -= res.amount;
    }

    if (amount) {
      // if we still have remaining space, directly resize the column
      const oldCol = state.cols[colIdx];
      if (amount < 0 && oldCol.width + amount < oldCol.minWidth) {
        amount = -(oldCol.width - oldCol.minWidth);
      }

      const newCol = new Column(
        oldCol.width + amount,
        oldCol.wrapWidth,
        oldCol.minWidth,
      );
      state = new ResizeState(
        state.cols.map((col, idx) => (idx === colIdx ? newCol : col)),
        state.maxSize,
        state.breakout,
      );
    }

    return state;
  }

  shrink(colIdx: number, origRequest: number) {
    let state: ResizeState = this;
    let remaining = origRequest;

    let canRedistribute =
      state.cols[colIdx + 1] || state.totalWidth > state.maxSize;
    if (!canRedistribute) {
      return state;
    }

    // try to shrink this one by giving from the column to the right first
    const res = state.moveSpaceFrom(state, colIdx, colIdx + 1, -remaining);

    remaining += res.amount;
    state = res.state;

    if (remaining < 0) {
      const res = this.stackSpace(state, colIdx, remaining);

      remaining += res.remaining;
      state = res.state;
    }

    canRedistribute =
      state.cols[colIdx + 1] || state.totalWidth > state.maxSize;

    if (remaining && canRedistribute) {
      // direct resize
      const oldCol = state.cols[colIdx];
      const oldNextCol = state.cols[colIdx + 1];

      if (oldCol.width + remaining < oldCol.minWidth) {
        remaining = -(oldCol.width - oldCol.minWidth);
      }

      if (!oldNextCol) {
        const newSum = state.totalWidth + remaining;
        if (newSum < state.maxSize) {
          remaining = state.maxSize - state.totalWidth - 1;
        }
      }

      const newCol = new Column(
        oldCol.width + remaining,
        oldCol.wrapWidth,
        oldCol.minWidth,
      );

      if (oldNextCol) {
        const nextCol = new Column(
          oldNextCol.width - remaining,
          oldNextCol.wrapWidth,
          oldNextCol.minWidth,
        );
        state = new ResizeState(
          state.cols.map(
            (col, idx) =>
              idx === colIdx ? newCol : idx === colIdx + 1 ? nextCol : col,
          ),
          state.maxSize,
        );
      } else {
        state = new ResizeState(
          state.cols.map((col, idx) => (idx === colIdx ? newCol : col)),
          state.maxSize,
        );
      }
    }

    return state;
  }

  resize(colIdx: number, amount: number) {
    if (amount > 0) {
      return this.grow(colIdx, amount);
    } else if (amount < 0) {
      return this.shrink(colIdx, amount);
    }

    return this;
  }

  // TODO: should handle when destIdx:
  // - is beyond the range, and then not give it back
  moveSpaceFrom(
    state: ResizeState,
    srcIdx: number,
    destIdx: number,
    amount: number,
    useFreeSpace: boolean = true,
  ) {
    const srcCol = state.cols[srcIdx];
    const destCol = state.cols[destIdx];

    const amountFor = what =>
      what === 'src'
        ? amount > 0
          ? -amount
          : amount
        : amount > 0
          ? amount
          : -amount;
    const widthFor = what =>
      (what === 'src' ? srcCol : destCol).width + amountFor(what);

    if (useFreeSpace) {
      // if taking more than source column's free space, only take that much
      if (amountFor('dest') > srcCol.freeSpace) {
        amount = amount > 0 ? srcCol.freeSpace : -srcCol.freeSpace;
      }
    }

    // if the source column shrinks past its min size, don't give the space away
    if (amountFor('src') < 0 && widthFor('src') < srcCol.minWidth) {
      amount = srcCol.width - srcCol.minWidth;
    }

    const newDest = destCol
      ? new Column(widthFor('dest'), destCol.wrapWidth, destCol.minWidth)
      : undefined;
    if (!newDest && amountFor('src') < 0) {
      // non-zero-sum game, ensure that we're not removing more than the total table width either
      if (state.totalWidth - srcCol.width + widthFor('src') < state.maxSize) {
        // would shrink table below max width, stop it
        amount =
          state.maxSize - (state.totalWidth - srcCol.width) - srcCol.width - 1;
      }
    }

    const newSrc = new Column(
      widthFor('src'),
      srcCol.wrapWidth,
      srcCol.minWidth,
    );

    const newCols = Array.from(state.cols)
      .map(
        (existingCol, idx) =>
          idx === srcIdx ? newSrc : idx === destIdx ? newDest : existingCol,
      )
      .filter(Boolean) as Column[];

    return { state: new ResizeState(newCols, state.maxSize), amount };
  }

  stackSpace(state, destIdx, amount) {
    const candidates = this.getCandidates(state, destIdx, amount);
    while (candidates.length && amount) {
      // search for most (or least) free space in candidates
      const candidateIdx = state.freeColFunc(candidates, amount);
      if (candidateIdx === -1) {
        // no free space remains
        break;
      }

      let { col: srcCol, idx: srcIdx } = candidates.splice(candidateIdx, 1)[0];

      if (srcCol.freeSpace <= 0) {
        // no more columns with free space remain
        break;
      }

      const res = this.moveSpaceFrom(state, srcIdx, destIdx, amount);
      state = res.state;
      amount -= res.amount;
    }

    return {
      state,
      remaining: amount,
    };
  }

  reduceSpace(state: ResizeState, amount: number, ignoreCols: number[] = []) {
    let remaining = amount;

    // keep trying to resolve resize request until we run out of free space,
    // or nothing to resize
    while (remaining) {
      // filter candidates only with free space
      const candidates = makeColIdxPair(state.cols).filter(colIdxPair => {
        return (
          colIdxPair.col.freeSpace && ignoreCols.indexOf(colIdxPair.idx) === -1
        );
      });

      if (candidates.length === 0) {
        break;
      }

      const requestedResize = Math.ceil(remaining / candidates.length);
      if (requestedResize === 0) {
        break;
      }

      candidates.forEach(candidate => {
        let newWidth = candidate.col.width - requestedResize;
        let remainder = 0;
        if (newWidth < candidate.col.minWidth) {
          // If the new requested width is less than our min
          // Calc what width we didn't use, we'll try extract that
          // from other cols.
          remainder = candidate.col.minWidth - newWidth;
          newWidth = candidate.col.minWidth;
        }

        const newCandidate = new Column(
          newWidth,
          candidate.col.wrapWidth,
          candidate.col.minWidth,
        );
        const newCols = Array.from(state.cols).map(
          (existingCol, idx) =>
            idx === candidate.idx ? newCandidate : existingCol,
        );
        state = new ResizeState(newCols, state.maxSize);

        remaining -= requestedResize + remainder;
      });
    }

    return state;
  }

  getCandidates(state: ResizeState, destIdx: number, amount: number) {
    let candidates = makeColIdxPair(state.cols);

    // only consider rows after the selected column in the direction of resize
    candidates =
      amount < 0 ? candidates.slice(0, destIdx) : candidates.slice(destIdx + 1);
    return candidates;
  }

  get totalWidth() {
    return this.cols.reduce((totalWidth, col) => totalWidth + col.width, 0) + 1;
  }

  scale(newWidth: number) {
    let state: ResizeState = this;
    const scaleFactor = newWidth / state.maxSize;

    state = new ResizeState(
      state.cols.map((col, colIdx) => {
        let newColWidth = Math.floor(col.width * scaleFactor);

        // enforce min width
        if (newColWidth < col.minWidth) {
          newColWidth = col.minWidth;
        }

        return new Column(newColWidth, col.wrapWidth, col.minWidth);
      }),
      newWidth,
    );

    const totalWidth = state.totalWidth;
    if (totalWidth > newWidth) {
      state = state.reduceSpace(state, totalWidth - newWidth);
    }

    return state;
  }

  scaleColToMinWidth(colIdx: number) {
    let state: ResizeState = this;
    const col = state.cols[colIdx];

    if (col) {
      return this.resize(colIdx, col.minWidth - col.width);
    }

    return state;
  }
}
