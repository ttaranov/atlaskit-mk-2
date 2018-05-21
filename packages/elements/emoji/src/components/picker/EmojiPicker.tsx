import * as React from 'react';
import * as styles from './styles';

import LoadingEmojiComponent, {
  Props as LoadingProps,
  State as LoadingState,
} from '../common/LoadingEmojiComponent';
import EmojiPickerComponent, { PickerRefHandler } from './EmojiPickerComponent';
import { LoadingItem } from './EmojiPickerVirtualItems';
import { OnEmojiEvent } from '../../types';
import { EmojiProvider } from '../../api/EmojiResource';
import { FireAnalyticsEvent, withAnalytics } from '@atlaskit/analytics';

export interface OldAnalytics {
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
}

export interface OwnProps extends LoadingProps {
  onSelection?: OnEmojiEvent;
  onPickerRef?: PickerRefHandler;
  hideToneSelector?: boolean;
}

export interface Props extends OldAnalytics, OwnProps {}

export class EmojiPickerInternal extends LoadingEmojiComponent<
  Props,
  LoadingState
> {
  constructor(props) {
    super(props, {});
  }

  renderLoading(): JSX.Element | null {
    const item = new LoadingItem();
    const handlePickerRef = (ref: any) => {
      if (this.props.onPickerRef) {
        this.props.onPickerRef(ref);
      }
    };
    return (
      <div className={styles.emojiPicker} ref={handlePickerRef}>
        {item.renderItem()}
      </div>
    );
  }

  renderLoaded(loadedEmojiProvider: EmojiProvider) {
    const { emojiProvider, ...otherProps } = this.props;

    return (
      <EmojiPickerComponent
        emojiProvider={loadedEmojiProvider}
        {...otherProps}
      />
    );
  }
}

// tslint:disable-next-line:variable-name
const EmojiPicker: React.ComponentClass<OwnProps> = withAnalytics<
  typeof EmojiPickerInternal
>(EmojiPickerInternal, {}, {}) as React.ComponentClass<OwnProps>;

type EmojiPicker = EmojiPickerInternal;

export default EmojiPicker;
