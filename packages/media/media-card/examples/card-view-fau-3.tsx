import * as React from 'react';
import styled from 'styled-components';
import MediaServicesAddCommentIcon from '@atlaskit/icon/glyph/media-services/add-comment';
import MediaServicesAnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import { tallImage } from '@atlaskit/media-test-helpers';
import { ActionButton, CardViewControlled } from '../src/files/v3/CardView';

const HorizontalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  > div {
    margin-right: 10px;
  }
`;

const previewActionButtons: ActionButton[] = [
  {
    icon: <MediaServicesAddCommentIcon label="comment" />,
    handler: () => console.log('comment button pressed'),
  },
  {
    icon: <MediaServicesAnnotateIcon label="annotate" />,
    handler: () => console.log('annotate button pressed'),
  },
];

const gridActionButtons: ActionButton[] = [
  {
    icon: <MediaServicesAnnotateIcon label="annotate" />,
    handler: () => console.log('annotate button pressed'),
  },
  {
    icon: <TrashIcon label="delete" />,
    handler: () => console.log('delete button pressed'),
  },
];

class CardViewFau3Example extends React.Component<any> {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Grid</th>
            <th>Grid (with thumbnail)</th>
            <th>Preview</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Uploading</th>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <CardViewControlled
                withMetadata={false}
                dataURI={tallImage}
                progress={0.3}
                withBlanket={true}
                withCancelButton={true}
                mediaName="Screen Shot 2018-09-05 at 1.51.42 PM"
              />
            </td>
          </tr>
          <tr>
            <th>Hover (Uploading)</th>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <CardViewControlled
                withMetadata={false}
                dataURI={tallImage}
                progress={0.3}
                withBlanket={true}
                withCancelButton={true}
                isHovered={true}
                mediaName="Screen Shot 2018-09-05 at 1.51.42 PM"
              />
            </td>
          </tr>
          <tr>
            <th>Processing</th>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <CardViewControlled
                withMetadata={false}
                dataURI={tallImage}
                withProcessing={true}
                withBlanket={true}
                withCancelButton={true}
                mediaName="Screen Shot 2018-09-05 at 1.51.42 PM"
              />
            </td>
          </tr>
          <tr>
            <th>Error</th>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <HorizontalWrapper>
                <CardViewControlled
                  withMetadata={false}
                  dataURI={tallImage}
                  error="Couldn't upload."
                  withBlanket={true}
                  withCancelButton={true}
                  mediaName="Screen Shot 2018-09-05 at 1.51.42 PM"
                />
                <CardViewControlled
                  withMetadata={false}
                  dataURI={tallImage}
                  error="Couldn't upload."
                  withBlanket={true}
                  withCancelButton={true}
                  onRetry={() => {}}
                  mediaName="Screen Shot 2018-09-05 at 1.51.42 PM"
                />
              </HorizontalWrapper>
            </td>
          </tr>
          <tr>
            <th>Resolved</th>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <CardViewControlled withMetadata={false} dataURI={tallImage} />
            </td>
          </tr>

          <tr>
            <th>Hover (resolved)</th>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <CardViewControlled
                selected={false}
                withMetadata={false}
                dataURI={tallImage}
                isHovered={true}
                actionButtons={previewActionButtons}
              />
            </td>
          </tr>
          <tr>
            <th>Selected</th>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <CardViewControlled
                selected={true}
                withMetadata={false}
                dataURI={tallImage}
                isHovered={false}
                actionButtons={previewActionButtons}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default CardViewFau3Example;
