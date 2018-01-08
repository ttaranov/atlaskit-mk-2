import * as React from 'react';
import { Component, FormEvent } from 'react';
import { connect } from 'react-redux';
import debounce = require('lodash.debounce');

import FieldText from '@atlaskit/field-text';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import { CardView } from '@atlaskit/media-card';

import { BricksLayout } from './bricksGrid';
import { fileClick } from '../../../actions/fileClick';
import { ImageCardModel } from '../../../tools/fetcher/fetcher';
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
} from './styles';
import { britney } from './images';

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

    if (hasError) {
      return this.renderError();
    }

    if (!isLoading && cardModels.length === 0) {
      return this.renderEmptyState();
    }

    return this.renderSearchResults();
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

    const loadMoreButton =
      isLoading ||
      totalResultCount === undefined ||
      cardModels.length < totalResultCount - 1
        ? this.renderLoadMoreButton()
        : null;

    return (
      <div>
        {this.renderMasonaryLayout(this.props.cardModels)}
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
      const dimensions = this.scaleThumbnailGif(actualDimensions);

      return (
        <GridCell key={`${i}-metadata.id`}>
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
        sizes={[{ columns: 3, gutter: 5 }]}
      >
        {cards}
      </BricksLayout>
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

  private scaleThumbnailGif = ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => {
    const desiredWith = 180;

    return {
      width: desiredWith,
      height: Math.round(desiredWith / width * height),
    };
  };

  private createSearchChangeHandler = () => {
    const { onSearchQueryChange } = this.props;
    const debouncedOnSearchQueryChange = debounce(onSearchQueryChange, 1000);

    return (e: FormEvent<HTMLInputElement>) => {
      const query: string = (e.target as any).value;
      this.setState({
        query,
      });

      debouncedOnSearchQueryChange(query);
    };
  };

  private createClickHandler = (cardModel: ImageCardModel) => {
    return () => {
      this.props.onCardClick(cardModel);
    };
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
