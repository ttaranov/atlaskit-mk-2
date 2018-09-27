import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { getOrientation, getFileInfo } from '../src';
import {
  InputWrapper,
  PreviewList,
  PreviewItem,
  PreviewImageContainer,
  Code,
} from './styled';
import Lozenge from '@atlaskit/lozenge';

const ORIENT_TRANSFORMS: { [key: number]: string } = {
  1: 'none',
  2: 'rotateY(180deg)',
  3: 'rotate(180deg)',
  4: 'rotate(180deg) rotateY(180deg)',
  5: 'rotate(270deg) rotateY(180deg)',
  6: 'rotate(90deg)',
  7: 'rotate(90deg) rotateY(180deg)',
  8: 'rotate(270deg)',
};

interface ExamplePreview {
  filename: string;
  src: string;
  orientation: number | null;
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
      const orientation = await getOrientation(file);
      const duration = Date.now() - startTime;
      previews.push({
        filename: file.name,
        orientation,
        src: fileInfo.src,
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
            <h1>Image Orientation Preview</h1>
            <p>
              <Lozenge>@atlaskit/media-ui</Lozenge> exports:{' '}
              <Code>getOrientation(file:File)</Code>
            </p>
            <p>
              async Example:
              <br />
              <Code>const orientation = await getOrientation(file);</Code>
            </p>
            <p>
              Select a local image to see it's Exif orientation (if available).<br />
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
      const orientation =
        preview.orientation === null ? 1 : preview.orientation;
      return (
        <PreviewItem key={`preview-${i}`}>
          <div>
            <p>
              filename:{' '}
              <Lozenge appearance="inprogress">{preview.filename}</Lozenge>
            </p>
            <p>
              orientation:{' '}
              <Lozenge appearance="success" isBold>
                {orientation}
              </Lozenge>
            </p>
            <p>
              transform:{' '}
              <Lozenge appearance="moved">
                {ORIENT_TRANSFORMS[orientation]}
              </Lozenge>
            </p>
            <p>
              duration: <Lozenge>{preview.duration}ms</Lozenge>
            </p>
          </div>
          <PreviewImageContainer>
            <img
              src={preview.src}
              style={{ transform: ORIENT_TRANSFORMS[orientation] }}
            />
          </PreviewImageContainer>
        </PreviewItem>
      );
    });
  }
}

export default () => <Example />;
