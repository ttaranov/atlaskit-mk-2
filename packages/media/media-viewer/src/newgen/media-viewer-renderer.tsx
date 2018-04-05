import * as React from 'react';
import Spinner from '@atlaskit/spinner';
import { FileViewer } from './file-viewer';
import { ErrorMessage, ArrowsWrapper, Arrow, ArrowWrapper } from './styled';
import { Model, Navigation, File, Action } from './domain';
import { Positioner } from './styled';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/chevron-left-circle';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';
import { colors } from '@atlaskit/theme';

export type Props = {
  model: Model;
  dispatcher: (action: Action) => void;
};

export interface NavigationProps {
  navigation: Navigation;
  dispatcher: (action: Action) => void;
}

const spinner = <div style={{ margin: 'auto' }}><Spinner invertColor size='large'/></div>;

const NavigationBar: React.StatelessComponent<NavigationProps> = ({navigation, dispatcher}) => {
  const createArrow = (icon:any, action: Action, alignment: string) =>
    <ArrowWrapper style={{ textAlign: alignment }} >
      <Arrow onClick={() => dispatcher(action)}>
        {icon}
      </Arrow>
    </ArrowWrapper>

  return (
    <ArrowsWrapper>
      {navigation.left.length ? createArrow(<ArrowLeftCircleIcon primaryColor={colors.N800} size='xlarge' label='Previous'/>, { type: 'NAVIGATION_EVENT', data: 'prev'}, 'left') : null}
      {navigation.right.length ? createArrow(<ArrowRightCircleIcon primaryColor={colors.N800} size='xlarge' label='Next' />, { type: 'NAVIGATION_EVENT', data: 'next'}, 'right'): null}
    </ArrowsWrapper>
  );
};

const renderSelectedItem = (item: File) => {
  const { fileDetails, filePreview } = item;
  switch (fileDetails.status) {
    case 'PENDING':
      return spinner;
    case 'SUCCESSFUL':
      if (fileDetails.data.mediaType === 'unknown') {
        return <ErrorMessage>This file is unsupported</ErrorMessage>;
      }
      if (filePreview.status === 'SUCCESSFUL') {
        return (
          <FileViewer previewData={filePreview.data} />
        )
      } else if (filePreview.status === 'PENDING') {
        return spinner;
      } else {
        return <ErrorMessage>Error rendering preview</ErrorMessage>;
      }
    case 'FAILED':
      return <ErrorMessage>ERROR. 🐻 with us, a nice error view will be shown here soon</ErrorMessage>;
  }
};

const renderMain = (model: Model, dispatcher: (action: Action) => void) => {
  switch(model.status) {
    case 'PENDING':
      return spinner;
    case 'FAILED':
      return <ErrorMessage>COLLECTION ERROR. 🐻 with us, a nice error view will be shown here soon</ErrorMessage>;
    case 'SUCCESSFUL':
      return (
        <div style={{width: '100%', textAlign: 'center'}}>
          <NavigationBar navigation={model.data} dispatcher={dispatcher} />
          {renderSelectedItem(model.data.selected)}
        </div>
      )
  }
};

export const MediaViewerRenderer: React.StatelessComponent<Props> = ({
  model,
  dispatcher
}) => {
  return (
    <Positioner onClick={() => dispatcher({ type: 'CLOSE' })} >
      {renderMain(model, dispatcher)}
    </Positioner>
  );
};
