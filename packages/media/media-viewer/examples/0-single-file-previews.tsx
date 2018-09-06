import * as React from 'react';
import Button from '@atlaskit/button';
import { createStorybookContext } from '@atlaskit/media-test-helpers';
import { ButtonList, Container, Group } from '../example-helpers/styled';
import {
  archiveItem,
  audioItem,
  audioItemNoCover,
  docItem,
  imageItem,
  largeImageItem,
  linkItem,
  smallImageItem,
  unsupportedItem,
  videoHorizontalFileItem,
  videoItem,
  videoLargeFileItem,
  videoProcessingFailedItem,
  wideImageItem,
  defaultCollectionName,
} from '../example-helpers';
import { MediaViewer, MediaViewerItem } from '../src';

const context = createStorybookContext();

export type State = {
  selectedItem?: MediaViewerItem;
};

export default class Example extends React.Component<{}, State> {
  state: State = { selectedItem: undefined };

  setItem = (selectedItem: MediaViewerItem) => () => {
    this.setState({ selectedItem });
  };

  render() {
    return (
      <Container>
        <Group>
          <h2>Image</h2>
          <ButtonList>
            <li>
              <Button onClick={this.setItem(imageItem)}>Picture</Button>
            </li>
            <li>
              <Button onClick={this.setItem(smallImageItem)}>Icon</Button>
            </li>
            <li>
              <Button onClick={this.setItem(wideImageItem)}>Wide image</Button>
            </li>
            <li>
              <Button onClick={this.setItem(largeImageItem)}>Tall image</Button>
            </li>
          </ButtonList>
        </Group>

        <Group>
          <h2>Document</h2>
          <ButtonList>
            <li>
              <Button onClick={this.setItem(docItem)}>Spreadsheet</Button>
            </li>
          </ButtonList>
        </Group>

        <Group>
          <h2>Video</h2>
          <ButtonList>
            <li>
              <Button onClick={this.setItem(videoHorizontalFileItem)}>
                Video horizontal
              </Button>
            </li>
            <li>
              <Button onClick={this.setItem(videoLargeFileItem)}>
                Video large
              </Button>
            </li>
            <li>
              <Button onClick={this.setItem(videoItem)}>Video vertical</Button>
            </li>
          </ButtonList>
        </Group>

        <Group>
          <h2>Audio</h2>
          <ButtonList>
            <li>
              <Button onClick={this.setItem(audioItem)}>Song with cover</Button>
            </li>
            <li>
              <Button onClick={this.setItem(audioItemNoCover)}>
                Song without cover
              </Button>
            </li>
          </ButtonList>
        </Group>

        <Group>
          <h2>Errors</h2>
          <ButtonList>
            <li>
              <Button onClick={this.setItem(unsupportedItem)}>
                Unsupported item
              </Button>
            </li>
            <li>
              <Button onClick={this.setItem(linkItem)}>Link</Button>
            </li>
            <li>
              <Button onClick={this.setItem(archiveItem)}>Archive</Button>
            </li>
            <li>
              <Button onClick={this.setItem(videoProcessingFailedItem)}>
                Failed video processing
              </Button>
            </li>
          </ButtonList>
        </Group>

        {this.state.selectedItem && (
          <MediaViewer
            featureFlags={{ customVideoPlayer: true }}
            context={context}
            selectedItem={this.state.selectedItem}
            dataSource={{ list: [this.state.selectedItem] }}
            collectionName={defaultCollectionName}
            onClose={() => this.setState({ selectedItem: undefined })}
          />
        )}
      </Container>
    );
  }
}
