import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import {
  getImageInfo,
  readImageMetaData,
  getFileInfo,
  ImageMetaData,
  getScaleFactor,
} from '../src';
import { InputWrapper, PreviewList, PreviewInfo } from './styled';

interface ExamplePreview {
  filename: string;
  src: string;
  scaleFactor: number;
  metadata: ImageMetaData | null;
}

export interface ExampleState {
  previews: ExamplePreview[];
}

class Example extends React.Component<{}, ExampleState> {
  state: ExampleState = {
    previews: [],
  };

  onChange = async (e: any) => {
    const { previews } = this.state;
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileInfo = await getFileInfo(file);
      const metadata = await readImageMetaData(fileInfo);
      const scaleFactor = getScaleFactor(
        fileInfo.file,
        metadata ? metadata.tags : null,
      );
      previews.push({
        filename: file.name,
        scaleFactor,
        src: fileInfo.src,
        metadata,
      });
      this.setState({ previews: [...previews] });
    }
  };

  render() {
    return (
      <Page>
        <Grid>
          <GridColumn>
            <h1>Image Meta Data Preview</h1>
            <p>
              Select a local image to see it's metadata.<br />
              Currently only supports Exif / XMP tags in <b>JPEG</b> and{' '}
              <b>PNG</b> formats.
            </p>
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            <InputWrapper>
              <input type="file" onChange={this.onChange} />
            </InputWrapper>
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            <PreviewList>{this.renderPreviews()}</PreviewList>
          </GridColumn>
        </Grid>
      </Page>
    );
  }

  renderPreviews() {
    return this.state.previews.map((preview, i) => {
      return (
        <li key={`preview-${i}`}>
          <div>{`${preview.filename} (x${
            preview.scaleFactor
          } scaleFactor)`}</div>
          <img src={preview.src} />
          <PreviewInfo>{JSON.stringify(preview.metadata, null, 4)}</PreviewInfo>
          <hr />
        </li>
      );
    });
  }
}

export default () => <Example />;
