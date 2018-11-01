import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Observable } from 'rxjs';
import { InlinePlayer, InlinePlayerProps } from '../../../root/inlinePlayer';
import { FileIdentifier } from '../../../root/domain';
import { CardLoading } from '../../../utils';
import { InlinePlayerWrapper } from '../../../root/styled';

describe('<InlinePlayer />', () => {
  const setup = (props?: Partial<InlinePlayerProps>) => {
    const context = {
      file: {
        getFileState: jest.fn().mockReturnValue(
          Observable.of({
            status: 'processed',
            artifacts: {
              'video_1280.mp4': {},
            },
          }),
        ),
        getArtifactURL: jest.fn().mockReturnValue('some-url'),
      },
    } as any;
    const identifier = {
      id: Promise.resolve('some-id'),
      collectionName: 'some-collection',
    } as FileIdentifier;

    const component = shallow(
      <InlinePlayer context={context} identifier={identifier} {...props} />,
    );

    return {
      component,
      context,
    };
  };
  const update = async (component: ShallowWrapper) => {
    await new Promise(resolve => setImmediate(resolve));
    component.update();
  };

  it('should render loading component when the video src is not ready', () => {
    const { component } = setup({
      dimensions: {
        width: 10,
        height: '5%',
      },
    });

    expect(component.find(CardLoading)).toHaveLength(1);
    expect(component.find(CardLoading).prop('dimensions')).toEqual({
      width: 10,
      height: '5%',
    });
  });

  it('should call getFileState with right properties', async () => {
    const { component, context } = setup();

    await update(component);
    expect(context.file.getFileState).toBeCalledTimes(1);
    expect(context.file.getFileState).toBeCalledWith('some-id', {
      collectionName: 'some-collection',
    });
  });

  it('should use default dimensions', () => {});

  it('should set dimensions in the wrapper element', async () => {
    const { component } = setup({
      dimensions: {
        width: 1,
        height: 1,
      },
    });

    await update(component);
    expect(component.find(InlinePlayerWrapper).prop('style')).toEqual({
      width: 1,
      height: 1,
    });
  });

  it('should use local preview if available', async () => {
    const context = {
      file: {
        getFileState: jest.fn().mockReturnValue(
          Observable.of({
            status: 'uploading',
            preview: {
              blob: {
                type: 'video/mp4',
              },
            },
          }),
        ),
      },
    } as any;
    const { component } = setup({ context });

    await update(component);
    expect(component.find('video').prop('src')).toEqual(
      'mock result of URL.createObjectURL()',
    );
  });

  it('should use right file artifact', async () => {
    const { component, context } = setup();

    await update(component);
    expect(context.file.getArtifactURL).toBeCalledTimes(1);
    expect(context.file.getArtifactURL).toBeCalledWith(
      { 'video_1280.mp4': {} },
      'video_1280.mp4',
      'some-collection',
    );
    expect(component.find('video').prop('src')).toEqual('some-url');
  });
});
