import * as React from 'react';
import { Component } from 'react';
import { Ellipsify } from '@atlaskit/media-ui';

import { ProgressBar } from '../progressBar';
import { MediaImage } from '../mediaImage';
import CardActions from '../cardActions';
import { CardAction } from '../../actions';
import {
  Wrapper,
  Overlay,
  Title,
  Body,
  ProgressWrapper,
  CardActionsWrapper,
} from './styled';

export interface UploadingViewProps {
  title?: string;
  progress: number;
  dataURI?: string;
  actions?: CardAction[];
}

export class UploadingView extends Component<UploadingViewProps, {}> {
  render() {
    const { title, progress, dataURI, actions } = this.props;

    return (
      <Wrapper>
        <Overlay>
          <Title>
            <Ellipsify text={title || ''} lines={2} />
          </Title>
          <Body>
            <ProgressWrapper>
              <ProgressBar progress={progress} />
            </ProgressWrapper>
            <CardActionsWrapper>
              {actions ? (
                <CardActions actions={actions} triggerColor="white" />
              ) : null}
            </CardActionsWrapper>
          </Body>
        </Overlay>
        {dataURI && <MediaImage dataURI={dataURI} />}
      </Wrapper>
    );
  }
}
