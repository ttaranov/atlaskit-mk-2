import * as React from 'react';
import * as PropTypes from 'prop-types';
import { PureComponent, SyntheticEvent } from 'react';
import * as classNames from 'classnames';

import * as styles from './styles';

import {
  customCategory,
  frequentCategory,
  analyticsEmojiPrefix,
} from '../../constants';
import {
  EmojiDescription,
  OptionalEmojiDescription,
  OptionalEmojiDescriptionWithVariations,
  EmojiId,
  EmojiSearchResult,
  EmojiUpload,
  OnEmojiEvent,
  SearchOptions,
  ToneSelection,
} from '../../types';
import {
  containsEmojiId,
  isPromise /*, isEmojiIdEqual, isEmojiLoaded*/,
} from '../../type-helpers';
import { SearchSort } from '../../types';
import { getToneEmoji } from '../../util/filters';
import { EmojiContext } from '../common/internal-types';
import { createRecordSelectionDefault } from '../common/RecordSelectionDefault';
import CategorySelector from './CategorySelector';
import EmojiPickerList from './EmojiPickerList';
import EmojiPickerFooter from './EmojiPickerFooter';
import {
  EmojiProvider,
  OnEmojiProviderChange,
  supportsUploadFeature,
} from '../../api/EmojiResource';
import { getEmojiVariation } from '../../api/EmojiRepository';
import { FireAnalyticsEvent } from '@atlaskit/analytics';
import { CategoryId } from './categories';

const FREQUENTLY_USED_MAX = 16;

export interface PickerRefHandler {
  (ref: any): any;
}

export interface Props {
  emojiProvider: EmojiProvider;
  onSelection?: OnEmojiEvent;
  onPickerRef?: PickerRefHandler;
  hideToneSelector?: boolean;
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
}

export interface State {
  // The emojis to be rendered in the picker - will include searchEmojis and frequentlyUsedEmojis
  filteredEmojis: EmojiDescription[];
  // The emojis returned from a search against the EmojiProvider
  searchEmojis: EmojiDescription[];
  // The emojis that are frequently used.
  frequentlyUsedEmojis?: EmojiDescription[];
  selectedEmoji?: EmojiDescription;
  activeCategory?: CategoryId;
  disableCategories?: boolean;
  dynamicCategories: CategoryId[];
  selectedTone?: ToneSelection;
  toneEmoji?: OptionalEmojiDescriptionWithVariations;
  query: string;
  uploadErrorMessage?: string;
  uploadSupported: boolean;
  uploading: boolean;
  emojiToDelete?: EmojiDescription;
  // the picker is considered loaded when at least 1 set of emojis have loaded
  loading: boolean;
  showUploadButton: boolean;
}

export default class EmojiPickerComponent extends PureComponent<Props, State> {
  static childContextTypes = {
    emoji: PropTypes.object,
  };

  static defaultProps = {
    onSelection: () => {},
  };

  constructor(props: Props) {
    super(props);
    const { emojiProvider, hideToneSelector } = props;

    this.state = {
      filteredEmojis: [],
      searchEmojis: [],
      frequentlyUsedEmojis: [],
      query: '',
      dynamicCategories: [],
      selectedTone: !hideToneSelector
        ? emojiProvider.getSelectedTone()
        : undefined,
      loading: true,
      uploadSupported: false,
      uploading: false,
      showUploadButton: true,
    };

    this.openTime = 0;
  }

  openTime: number;

  getChildContext(): EmojiContext {
    return {
      emoji: {
        emojiProvider: this.props.emojiProvider,
      },
    };
  }

  componentWillMount() {
    this.openTime = Date.now();
    this.fireAnalytics('open');
  }

  componentDidMount() {
    const { emojiProvider, hideToneSelector } = this.props;
    emojiProvider.subscribe(this.onProviderChange);
    this.onSearch(this.state.query);
    if (supportsUploadFeature(emojiProvider)) {
      emojiProvider.isUploadSupported().then(this.onUploadSupported);
    }
    if (!hideToneSelector) {
      const toneEmoji = getToneEmoji(emojiProvider);
      if (isPromise(toneEmoji)) {
        toneEmoji.then(emoji => this.setState({ toneEmoji: emoji }));
      } else {
        this.setState({ toneEmoji });
      }
    }
  }

  componentWillUnmount() {
    const { emojiProvider } = this.props;
    emojiProvider.unsubscribe(this.onProviderChange);
    this.fireAnalytics('close');
  }

  componentWillReceiveProps(nextProps: Props) {
    const prevEmojiProvider = this.props.emojiProvider;
    const nextEmojiProvider = nextProps.emojiProvider;
    if (prevEmojiProvider !== nextEmojiProvider) {
      if (supportsUploadFeature(nextEmojiProvider)) {
        nextEmojiProvider.isUploadSupported().then(this.onUploadSupported);
      }
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const prevEmojiProvider = prevProps.emojiProvider;
    const currentEmojiProvider = this.props.emojiProvider;

    if (prevEmojiProvider !== currentEmojiProvider) {
      prevEmojiProvider.unsubscribe(this.onProviderChange);
      currentEmojiProvider.subscribe(this.onProviderChange);

      // We changed provider which means we subscribed to filter results for a new subscriber.
      // So we refresh the emoji display with onSearch and we do it here, after the new props have
      // been set since onSearch leads to filter being called on the current emojiProvider.
      // (Calling onSearch in a '...Will...' lifecycle method would lead to filter being called on
      // an emojiProvider we have already unsubscribed from)
      this.onSearch(this.state.query);
    }
  }

  onEmojiActive = (emojiId: EmojiId, emoji: EmojiDescription) => {
    if (this.state.selectedEmoji !== emoji) {
      this.setState({
        selectedEmoji: emoji,
        showUploadButton: false,
      } as State);
    } else {
      this.setState({
        showUploadButton: false,
      } as State);
    }
  };

  onCategoryActivated = (category: CategoryId) => {
    if (this.state.activeCategory !== category) {
      this.setState({
        activeCategory: category,
      } as State);
    }
  };

  onCategorySelected = (categoryId: CategoryId) => {
    const { emojiProvider } = this.props;
    emojiProvider.findInCategory(categoryId).then(emojisInCategory => {
      const { disableCategories } = this.state;
      if (!disableCategories) {
        let selectedEmoji;
        if (emojisInCategory && emojisInCategory.length > 0) {
          selectedEmoji = getEmojiVariation(emojisInCategory[0], {
            skinTone: this.state.selectedTone,
          });
        }

        const emojiPickerList = this.refs.emojiPickerList as EmojiPickerList;
        if (emojiPickerList) {
          emojiPickerList.reveal(categoryId);
        }

        this.setState({
          activeCategory: categoryId,
          selectedEmoji,
        } as State);
        this.fireAnalytics('category.select', { categoryName: categoryId });
      }
    });
  };

  onFileChosen = () => {
    this.fireAnalytics('upload.file.selected');
  };

  onEmojiPickerMouseLeave = () => {
    this.setState({
      showUploadButton: true,
    });
  };

  onEmojiPickerMouseEnter = () => {
    this.setState({
      showUploadButton: false,
    });
  };

  private fireAnalytics = (eventName: string, data: any = {}): void => {
    const { firePrivateAnalyticsEvent } = this.props;

    if (firePrivateAnalyticsEvent) {
      firePrivateAnalyticsEvent(`${analyticsEmojiPrefix}.${eventName}`, data);
    }
  };

  private calculateElapsedTime = () => {
    return Date.now() - this.openTime;
  };

  private onUploadSupported = (supported: boolean) => {
    this.setState({
      uploadSupported: supported,
    });
  };

  private onSearch = query => {
    this.setState({
      query,
    });
    this.updateEmojis(query, { skinTone: this.state.selectedTone });
  };

  private onSearchResult = (searchResults: EmojiSearchResult): void => {
    const frequentlyUsedEmoji = this.state.frequentlyUsedEmojis || [];
    const searchQuery = searchResults.query || '';

    const emojiToRender = this.buildQuerySpecificEmojiList(
      searchQuery,
      searchResults.emojis,
      frequentlyUsedEmoji,
    );
    this.setStateAfterEmojiChange(
      searchQuery,
      emojiToRender,
      searchResults.emojis,
      frequentlyUsedEmoji,
    );
  };

  private onFrequentEmojiResult = (frequentEmoji: EmojiDescription[]): void => {
    const { query, searchEmojis } = this.state;
    // change the category of each of the featured emoji
    const recategorised = frequentEmoji.map(emoji => {
      const clone = JSON.parse(JSON.stringify(emoji));
      clone.category = frequentCategory;
      return clone;
    });

    const emojiToRender = this.buildQuerySpecificEmojiList(
      query,
      searchEmojis,
      recategorised,
    );
    this.setStateAfterEmojiChange(
      query,
      emojiToRender,
      searchEmojis,
      recategorised,
    );
  };

  /**
   * If there is no user search in the EmojiPicker then it should display all emoji received from the EmojiRepository and should
   * also include a special category of most frequently used emoji (if there are any). This method decides if we are in this 'no search'
   * state and appends the frequent emoji if necessary.
   *
   * @param searchEmoji the emoji last received from the EmojiRepository after a search (may be empty)
   * @param frequentEmoji the frequently used emoji last received from the EmojiRepository (may be empty)
   */
  private buildQuerySpecificEmojiList(
    query: string,
    searchEmoji: EmojiDescription[],
    frequentEmoji: EmojiDescription[],
  ): EmojiDescription[] {
    // If there are no frequent emoji, or if there was a search query then we want to take the search result exactly as is.
    if (!frequentEmoji.length || query) {
      return searchEmoji;
    }

    return [...searchEmoji, ...frequentEmoji];
  }

  /**
   * Calculate and set the new state of the component in response to the list of emoji changing for some reason (a search has returned
   * or the frequently used emoji have updated.)
   */
  private setStateAfterEmojiChange(
    query: string,
    emojiToRender: EmojiDescription[],
    searchEmoji: EmojiDescription[],
    frequentEmoji: EmojiDescription[],
  ) {
    const { filteredEmojis } = this.state;

    // Only enable categories for full emoji list (non-search)
    const disableCategories = !!query;
    if (!disableCategories && emojiToRender.length !== filteredEmojis.length) {
      this.getDynamicCategories().then(categories => {
        this.onDynamicCategoryChange(categories);
      });
    }

    let selectedEmoji;
    let activeCategory;
    if (containsEmojiId(emojiToRender, this.state.selectedEmoji)) {
      // Keep existing emoji selected if still in results
      selectedEmoji = this.state.selectedEmoji;
      activeCategory = this.state.activeCategory;
    } else {
      selectedEmoji = undefined;
      // Only enable categories for full emoji list (non-search)
      activeCategory = undefined;
    }

    this.setState({
      filteredEmojis: emojiToRender,
      searchEmojis: searchEmoji,
      frequentlyUsedEmojis: frequentEmoji,
      selectedEmoji,
      activeCategory,
      disableCategories,
      query,
      loading: false,
    } as State);
  }

  private onDynamicCategoryChange = (categories: CategoryId[]) => {
    this.setState({
      dynamicCategories: categories,
    });
  };

  private onProviderChange: OnEmojiProviderChange = {
    result: this.onSearchResult,
  };

  private onToneSelected = (toneValue: ToneSelection) => {
    this.setState({
      selectedTone: toneValue,
    } as State);
    this.props.emojiProvider.setSelectedTone(toneValue);
    const { query = '' } = this.state;
    this.updateEmojis(query, { skinTone: toneValue });
  };

  /**
   * Updates the emoji displayed by the picker. If there is no query specified then we expect to retrieve all emoji for display,
   * by category, in the picker. This differs from when there is a query in which case we expect to receive a sorted result matching
   * the search.
   */
  private updateEmojis = (query?: string, options?: SearchOptions) => {
    // if the query is empty then we want the emoji to be in service defined order, unless specified otherwise
    // and we want emoji for the 'frequently used' category to be refreshed as well.
    if (!query) {
      if (!options) {
        options = {};
      }

      if (!options.sort) {
        options.sort = SearchSort.None;
      }

      // take a copy of search options so that the frequently used can be limited to 16 without affecting the full emoji query
      const frequentOptions: SearchOptions = {
        ...options,
        sort: SearchSort.None,
        limit: FREQUENTLY_USED_MAX,
      };

      this.props.emojiProvider
        .getFrequentlyUsed(frequentOptions)
        .then(this.onFrequentEmojiResult);
    }

    this.props.emojiProvider.filter(query, options);
  };

  private onOpenUpload = () => {
    // Prime upload token so it's ready when the user adds
    const { emojiProvider } = this.props;
    if (supportsUploadFeature(emojiProvider)) {
      emojiProvider.prepareForUpload();
    }

    this.setState({
      uploadErrorMessage: undefined,
      uploading: true,
    });
    this.fireAnalytics('upload.trigger');
  };

  private onUploadEmoji = (upload: EmojiUpload) => {
    const { emojiProvider } = this.props;
    this.setState({
      uploadErrorMessage: undefined, // clear previous errors
    });
    this.fireAnalytics('upload.start');
    if (supportsUploadFeature(emojiProvider)) {
      emojiProvider
        .uploadCustomEmoji(upload)
        .then(emojiDescription => {
          this.setState({
            activeCategory: customCategory,
            selectedEmoji: emojiDescription,
            uploading: false,
          });
          // this.loadEmoji(emojiProvider, emojiDescription);
          this.scrollToEndOfList();
          this.fireAnalytics('upload.successful', {
            duration: this.calculateElapsedTime(),
          });
        })
        .catch(err => {
          this.setState({
            uploadErrorMessage: 'Upload failed',
          });
          // tslint:disable-next-line
          console.error('Unable to upload emoji', err);
          this.fireAnalytics('upload.failed');
        });
    }
  };

  private onTriggerDelete = (emojiId: EmojiId, emoji: EmojiDescription) => {
    this.setState({ emojiToDelete: emoji });
  };

  private onCloseDelete = () => {
    this.setState({ emojiToDelete: undefined });
  };

  private onDeleteEmoji = (emoji: EmojiDescription): Promise<boolean> => {
    const { query, selectedTone } = this.state;
    return this.props.emojiProvider.deleteSiteEmoji(emoji).then(success => {
      if (success) {
        this.updateEmojis(query, { skinTone: selectedTone });
      }
      return success;
    });
  };

  private scrollToEndOfList = () => {
    const emojiPickerList = this.refs.emojiPickerList as EmojiPickerList;
    if (emojiPickerList) {
      // Wait a tick to ensure repaint and updated height for picker list
      setTimeout(() => {
        emojiPickerList.scrollToBottom();
      }, 0);
    }
  };

  private onUploadCancelled = () => {
    this.setState({
      uploading: false,
      uploadErrorMessage: undefined,
    });
    this.fireAnalytics('upload.cancel');
  };

  private getDynamicCategories(): Promise<CategoryId[]> {
    if (!this.props.emojiProvider.calculateDynamicCategories) {
      return Promise.resolve([]);
    }

    return this.props.emojiProvider.calculateDynamicCategories() as Promise<
      CategoryId[]
    >;
  }

  private handlePickerRef = (ref: any) => {
    if (this.props.onPickerRef) {
      this.props.onPickerRef(ref);
    }
  };

  private onSelectWrapper = (
    emojiId: EmojiId,
    emoji: OptionalEmojiDescription,
    event?: SyntheticEvent<any>,
  ): void => {
    const { onSelection } = this.props;
    const { query } = this.state;
    if (onSelection) {
      onSelection(emojiId, emoji, event);
      this.fireAnalytics('item.select', {
        duration: this.calculateElapsedTime(),
        emojiId: emojiId.id || '',
        type: (emoji && emoji.type) || '',
        queryLength: (query && query.length) || 0,
      });
    }
  };

  render() {
    const { emojiProvider } = this.props;
    const {
      activeCategory,
      disableCategories,
      dynamicCategories,
      filteredEmojis,
      loading,
      query,
      selectedEmoji,
      selectedTone,
      toneEmoji,
      emojiToDelete,
      uploading,
      uploadErrorMessage,
      uploadSupported,
      showUploadButton,
    } = this.state;

    const recordUsageOnSelection = createRecordSelectionDefault(
      emojiProvider,
      this.onSelectWrapper,
    );

    const classes = [styles.emojiPicker];

    const picker = (
      <div
        className={classNames(classes)}
        ref={this.handlePickerRef}
        data-emoji-picker-container
      >
        <CategorySelector
          activeCategoryId={activeCategory}
          dynamicCategories={dynamicCategories}
          disableCategories={disableCategories}
          onCategorySelected={this.onCategorySelected}
        />
        <EmojiPickerList
          emojis={filteredEmojis}
          currentUser={emojiProvider.getCurrentUser()}
          onEmojiSelected={recordUsageOnSelection}
          onEmojiActive={this.onEmojiActive}
          onEmojiDelete={this.onTriggerDelete}
          onCategoryActivated={this.onCategoryActivated}
          onMouseLeave={this.onEmojiPickerMouseLeave}
          onMouseEnter={this.onEmojiPickerMouseEnter}
          onSearch={this.onSearch}
          query={query}
          selectedTone={selectedTone}
          loading={loading}
          ref="emojiPickerList"
        />
        <EmojiPickerFooter
          initialUploadName={query}
          selectedEmoji={selectedEmoji}
          selectedTone={selectedTone}
          onToneSelected={this.onToneSelected}
          toneEmoji={toneEmoji}
          uploading={uploading}
          emojiToDelete={emojiToDelete}
          uploadErrorMessage={uploadErrorMessage}
          uploadEnabled={uploadSupported && showUploadButton && !uploading}
          onUploadEmoji={this.onUploadEmoji}
          onUploadCancelled={this.onUploadCancelled}
          onDeleteEmoji={this.onDeleteEmoji}
          onCloseDelete={this.onCloseDelete}
          onFileChosen={this.onFileChosen}
          onOpenUpload={this.onOpenUpload}
        />
      </div>
    );

    return picker;
  }
}
