import * as React from 'react';
import * as styles from './styles';

import LoadingEmojiComponent, {
  Props as LoadingProps,
  State as LoadingState,
} from '../common/LoadingEmojiComponent';
import EmojiPickerComponent, { PickerRefHandler } from './EmojiPickerComponent';
import { LoadingItem } from './EmojiPickerVirtualItems';
import { OnEmojiEvent } from '@atlaskit/emoji-provider';
import { EmojiProvider } from '@atlaskit/emoji';
import { FireAnalyticsEvent, withAnalytics } from '@atlaskit/analytics';

const emojiPickerModuleLoader = () =>
  import(/* webpackChunkName:"@atlaskit-internal_emojiPickerComponent" */ './EmojiPickerComponent');

const emojiPickerLoader: () => Promise<typeof EmojiPickerComponent> = () =>
  emojiPickerModuleLoader().then(module => module.default);

export interface Props extends LoadingProps {
  onSelection?: OnEmojiEvent;
  onPickerRef?: PickerRefHandler;
  hideToneSelector?: boolean;
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
}

export class EmojiPickerInternal extends LoadingEmojiComponent<
  Props,
  LoadingState
> {
  static LazyEmojiPickerComponent: typeof EmojiPickerComponent;

  constructor(props) {
    super(props, {});
  }

  async lazyLoadEmojiPickerComponent() {
    if (!EmojiPickerInternal.LazyEmojiPickerComponent) {
      EmojiPickerInternal.LazyEmojiPickerComponent = await emojiPickerLoader();
    }
    this.forceUpdate();
  }

  componentDidMount() {
    this.lazyLoadEmojiPickerComponent();
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
    const { LazyEmojiPickerComponent } = EmojiPickerInternal;
    if (!LazyEmojiPickerComponent) {
      // spinner??
      return null;
    }
    return (
      <LazyEmojiPickerComponent
        emojiProvider={loadedEmojiProvider}
        {...otherProps}
      />
    );
  }
}

// tslint:disable-next-line:variable-name
const EmojiPicker = withAnalytics<typeof EmojiPickerInternal>(
  EmojiPickerInternal,
  {},
  {},
);
type EmojiPicker = EmojiPickerInternal;

export default EmojiPicker;
