import * as React from 'react';

import { RelativePosition } from '../../types';
import { EmojiProvider } from '../../api/EmojiResource';
import LoadingEmojiComponent, {
  Props as LoadingProps,
  State as LoadingState,
} from '../common/LoadingEmojiComponent';
import EmojiTypeAheadComponent, {
  EmojiTypeAheadBaseProps,
} from './EmojiTypeAheadComponent';
import Popup from '../common/Popup';
import debug from '../../util/logger';

export interface Props extends EmojiTypeAheadBaseProps, LoadingProps {
  /** CSS selector, or target HTML element */
  target?: string | HTMLElement;
  position?: RelativePosition;
  zIndex?: number | string;
  offsetX?: number;
  offsetY?: number;
}

export default class EmojiTypeahead extends LoadingEmojiComponent<
  Props,
  LoadingState
> {
  constructor(props) {
    super(props, {});
  }

  selectNext = () => {
    if (this.refs.typeAhead) {
      (this.refs.typeAhead as EmojiTypeAheadComponent).selectNext();
    }
  };

  selectPrevious = () => {
    if (this.refs.typeAhead) {
      (this.refs.typeAhead as EmojiTypeAheadComponent).selectPrevious();
    }
  };

  chooseCurrentSelection = () => {
    if (this.refs.typeAhead) {
      (this.refs.typeAhead as EmojiTypeAheadComponent).chooseCurrentSelection();
    }
  };

  count = (): number => {
    if (this.refs.typeAhead) {
      return (this.refs.typeAhead as EmojiTypeAheadComponent).count();
    }
    return 0;
  };

  renderLoaded(loadedEmojiProvider: EmojiProvider) {
    const {
      emojiProvider,
      target,
      position,
      zIndex,
      offsetX,
      offsetY,
      ...otherProps
    } = this.props;

    const typeAhead = (
      <EmojiTypeAheadComponent
        {...otherProps}
        emojiProvider={loadedEmojiProvider}
        ref="typeAhead"
      />
    );

    if (position) {
      debug('target, position', target, position);
      if (target) {
        return (
          <Popup
            target={target}
            relativePosition={position}
            zIndex={zIndex}
            offsetX={offsetX}
            offsetY={offsetY}
            children={typeAhead}
          />
        );
      }
      // don't show if we have a position, but no target yet
      return null;
    }

    return typeAhead;
  }
}
