import * as React from 'react';
import { Component, FormEvent } from 'react';
import { connect } from 'react-redux';
import * as debounce from 'lodash.debounce';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import FieldText from '@atlaskit/field-text';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import { CardView } from '@atlaskit/media-card';
import Flag, { FlagGroup } from '@atlaskit/flag';

import { BricksLayout } from './bricksGrid';
import { fileClick } from '../../../actions/fileClick';
import { ImageCardModel } from '../../../tools/fetcher/fetcher';
import gridCellScaler from '../../../tools/gridCellScaler';
import { State, SelectedItem } from '../../../domain';
import { searchGiphy } from '../../../actions/searchGiphy';

import {
  Container,
  Title,
  ButtonContainer,
  GridCell,
  WarningContainer,
  WarningImage,
  WarningHeading,
  WarningSuggestion,
  SpinnerWrapper,
} from './styles';
import { britney } from './images';

const NUMBER_OF_COLUMNS = 4;
const GAP_SIZE = 5;
const CONTAINER_WIDTH = 677;

export interface GiphyViewStateProps {
  hasError: boolean;
  isLoading: boolean;
  cardModels: ImageCardModel[];
  totalResultCount?: number;
  selectedItems: SelectedItem[];
}

export interface GiphyViewDispatchProps {
  onSearchQueryChange(query: string): void;
  onLoadMoreButtonClick(query: string, shouldAppendResults: boolean): void;
  onCardClick(item: ImageCardModel): void;
}

export type GiphyViewProps = GiphyViewStateProps & GiphyViewDispatchProps;

export interface GiphyViewState {
  query: string;
}

export class GiphyView extends Component<GiphyViewProps, GiphyViewState> {
  private searchChangeHandler: (e: FormEvent<HTMLInputElement>) => void;

  constructor(props: GiphyViewProps) {
    super(props);

    this.state = {
      query: '',
    };

    this.searchChangeHandler = this.createSearchChangeHandler();
  }

  componentDidUpdate({
    onSearchQueryChange: oldOnSearchQueryChange,
  }: GiphyViewProps) {
    const { onSearchQueryChange: newOnSearchQueryChange } = this.props;

    if (oldOnSearchQueryChange !== newOnSearchQueryChange) {
      this.createSearchChangeHandler();
    }
  }

  render(): JSX.Element {
    const { query } = this.state;

    return (
      <Container id="mediapicker-giphy-container">
        <Title>GIPHY</Title>
        <FieldText
          label=""
          placeholder="Search all the GIFs!"
          onChange={this.searchChangeHandler}
          shouldFitContainer={true}
          value={query}
        />
        {this.getContent()}
      </Container>
    );
  }

  private getContent = () => {
    const { hasError, isLoading, cardModels } = this.props;

    const hasResults = cardModels.length > 0;
    if (hasError) {
      if (hasResults) {
        return (
          <div>
            {this.renderErrorFlag()}
            {this.renderSearchResults()}
          </div>
        );
      } else {
        return this.renderError();
      }
    }

    if (!isLoading && !hasResults) {
      return this.renderEmptyState();
    }

    return this.renderSearchResults();
  };

  private renderErrorFlag = () => {
    return (
      <FlagGroup>
        <Flag
          appearance="error"
          title="We've failed to load more results"
          description="Check your network connection and feel free to try again."
          icon={<ErrorIcon label="error" />}
          id="giphy-search-failed-flag"
          actions={[
            { content: 'Try again', onClick: this.handleLoadMoreButtonClick },
          ]}
        />
      </FlagGroup>
    );
  };

  private renderError = () => {
    return (
      <WarningContainer>
        <WarningImage src={britney} />
        <WarningHeading>Oops! I did it again...</WarningHeading>
        <WarningSuggestion>Check your network connection</WarningSuggestion>
        <Button onClick={this.handleRetryButtonClick}>Try again</Button>
      </WarningContainer>
    );
  };

  private renderEmptyState = () => {
    const { query } = this.state;

    // The GIF used in this error state is too large to store as a data URI (> 3.2 MB)
    return (
      <WarningContainer>
        <WarningImage src="https://media1.giphy.com/media/10YK5Hh53nC3dK/200w.gif" />
        <WarningHeading>Hello? Was it me you're looking for?</WarningHeading>
        <WarningSuggestion>
          We couldn't find anything for "{query}"
        </WarningSuggestion>
      </WarningContainer>
    );
  };

  private renderSearchResults = () => {
    const { isLoading, cardModels, totalResultCount } = this.props;

    const isThereAreMoreResults =
      totalResultCount === undefined ||
      cardModels.length < totalResultCount - 1;
    const isEmpty = cardModels.length === 0;
    const shouldShowLoadMoreButton =
      !isEmpty && (isLoading || isThereAreMoreResults);
    const shouldShowInitialPreloader = isLoading && isEmpty;

    const loadMoreButton =
      shouldShowLoadMoreButton && this.renderLoadMoreButton();
    const initialPreloadAnimation =
      shouldShowInitialPreloader && this.renderInitialPreloadAnimation();

    return (
      <div>
        {this.renderMasonaryLayout(this.props.cardModels)}
        {initialPreloadAnimation}
        {loadMoreButton}
      </div>
    );
  };

  private renderMasonaryLayout = (cardModels: ImageCardModel[]) => {
    if (cardModels.length === 0) {
      return null;
    }

    const cards = cardModels.map((cardModel, i) => {
      const { dataURI, metadata, dimensions: actualDimensions } = cardModel;
      const { selectedItems } = this.props;

      const selected = selectedItems.some(
        item => item.id === metadata.id && item.serviceName === 'giphy',
      );
      const dimensions = gridCellScaler({
        ...actualDimensions,
        gapSize: GAP_SIZE,
        containerWidth: CONTAINER_WIDTH,
        numberOfColumns: NUMBER_OF_COLUMNS,
      });

      return (
        <GridCell key={`${i}-metadata.id`} width={dimensions.width}>
          <CardView
            status="complete"
            dataURI={dataURI}
            metadata={metadata}
            dimensions={dimensions}
            selectable={true}
            selected={selected}
            onClick={this.createClickHandler(cardModel)}
          />
        </GridCell>
      );
    });

    return (
      <BricksLayout
        id="mediapicker-gif-layout"
        sizes={[{ columns: NUMBER_OF_COLUMNS, gutter: GAP_SIZE }]}
      >
        {cards}
      </BricksLayout>
    );
  };

  private renderInitialPreloadAnimation = () => {
    return (
      <SpinnerWrapper>
        <Spinner size="large" />
      </SpinnerWrapper>
    );
  };

  private renderLoadMoreButton = () => {
    const { isLoading } = this.props;
    const iconAfter = isLoading ? <Spinner /> : undefined;

    return (
      <ButtonContainer>
        <Button
          onClick={this.handleLoadMoreButtonClick}
          isDisabled={isLoading}
          iconAfter={iconAfter}
        >
          Load more GIFs
        </Button>
      </ButtonContainer>
    );
  };

  private createSearchChangeHandler = () => {
    const { onSearchQueryChange } = this.props;
    const debouncedOnSearchQueryChange = debounce(query => {
      onSearchQueryChange(query);
      this.setState({
        query,
      });
    }, 1000);

    return (e: FormEvent<HTMLInputElement>) => {
      const query: string = e.currentTarget.value;
      debouncedOnSearchQueryChange(query);
    };
  };

  private createClickHandler = (cardModel: ImageCardModel) => () => {
    this.props.onCardClick(cardModel);
  };

  private handleLoadMoreButtonClick = () => {
    const { onLoadMoreButtonClick } = this.props;
    onLoadMoreButtonClick(this.state.query, true);
  };

  private handleRetryButtonClick = () => {
    const { onSearchQueryChange } = this.props;
    onSearchQueryChange(this.state.query);
  };
}

export default connect<GiphyViewStateProps, GiphyViewDispatchProps, {}>(
  (state: State) => ({
    hasError: state.view.hasError,
    isLoading: state.view.isLoading,
    cardModels: state.giphy.imageCardModels,
    totalResultCount: state.giphy.totalResultCount,
    selectedItems: state.selectedItems,
  }),
  dispatch => ({
    onSearchQueryChange: query => dispatch(searchGiphy(query, false)),
    onLoadMoreButtonClick: (query, shouldAppendResults) =>
      dispatch(searchGiphy(query, shouldAppendResults)),
    onCardClick: cardModel => {
      const { id, name, size } = cardModel.metadata;

      dispatch(
        fileClick(
          {
            mimeType: 'image/gif',
            id: id || '',
            name: name || '',
            size: size || 0,
            date: Date.now(),
          },
          'giphy',
        ),
      );
    },
  }),
)(GiphyView);
