import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import {
  readImageMetaData,
  getFileInfo,
  ImageMetaData,
  getScaleFactor,
} from '../src';
import { InputWrapper, PreviewList, PreviewInfo, PreviewItem } from './styled';

interface ExamplePreview {
  filename: string;
  src: string;
  scaleFactor: number;
  metadata: ImageMetaData | null;
  duration: number;
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
      const startTime = Date.now();
      const fileInfo = await getFileInfo(file);
      const metadata = await readImageMetaData(fileInfo);
      const scaleFactor = getScaleFactor(
        fileInfo.file,
        metadata ? metadata.tags : null,
      );
      const duration = Date.now() - startTime;
      previews.push({
        filename: file.name,
        scaleFactor,
        src: fileInfo.src,
        metadata,
        duration,
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
        <PreviewItem key={`preview-${i}`}>
          <div>{`${preview.filename} ~ x${preview.scaleFactor} scaleFactor ~ ${
            preview.duration
          }ms`}</div>
          <img src={preview.src} />
          <PreviewInfo>{JSON.stringify(preview.metadata, null, 4)}</PreviewInfo>
        </PreviewItem>
      );
    });
  }
}

export default () => <Example />;
