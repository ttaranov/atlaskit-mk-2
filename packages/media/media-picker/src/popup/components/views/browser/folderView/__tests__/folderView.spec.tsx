import AkButton from '@atlaskit/button';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { FolderViewer, FolderViewerProps } from '../folderView';
import {
  FileIcon,
  FileName,
  FileCreateDate,
  FileSize,
  FolderViewerRow,
} from '../styled';

import * as datefmt from 'dateformat';
import Spinner from '@atlaskit/spinner';

describe('<FolderViewer />', () => {
  const setup = () => {
    const props: FolderViewerProps = {
      path: [],
      accounts: [],
      service: {
        accountId: 'some-service-account-id',
        name: 'google',
      },
      items: [],
      selectedItems: [],
      isLoading: false,
      onFileClick: jest.fn(),
      onFolderClick: jest.fn(),
      onLoadMoreClick: jest.fn(),
    };

    return { props };
  };

  it('should render loading button given folder is loading', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer
        {...props}
        isLoading={true}
        currentCursor="some-current-cursor"
      />,
    );

    const buttons = wrapper.find(AkButton);
    expect(buttons).toHaveLength(1);

    const button = buttons.first();
    expect((button.props() as any).children).toEqual('Loading...');
  });

  it('should not call onLoadMoreClick handler given folder is loading', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer
        {...props}
        isLoading={true}
        currentCursor="some-current-cursor"
      />,
    );

    const buttons = wrapper.find(AkButton);
    const button = buttons.first();

    button.simulate('click');
    expect(wrapper.instance().props.onLoadMoreClick).not.toBeCalled();
  });

  it('should render load more button given next page cursor', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer {...props} nextCursor="some-next-cursor" />,
    );

    const buttons = wrapper.find(AkButton);
    expect(buttons).toHaveLength(1);

    const button = buttons.first();
    expect((button.props() as any).children).toEqual('Load more');
  });

  it('should call onLoadMoreClick handler given next page cursor', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer {...props} nextCursor="some-next-cursor" />,
    );

    const buttons = wrapper.find(AkButton);
    const button = buttons.first();

    button.simulate('click');
    expect(wrapper.instance().props.onLoadMoreClick).toBeCalled();
  });

  it('empty items should not be rendered', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer {...props} items={[]} nextCursor="some-next-cursor" />,
    );

    const fileIcons = wrapper.find(FileIcon);

    expect(fileIcons).toHaveLength(0);
  });

  it('google items should not be rendered', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer
        {...props}
        items={[
          {
            mimeType: 'application/vnd.google-apps.somethingsomething',
            id: '1',
            name: 'folderName',
            size: 0,
            date: 0,
          },
        ]}
        nextCursor="some-next-cursor"
      />,
    );

    const fileIcons = wrapper.find(FileIcon);

    expect(fileIcons).toHaveLength(0);
  });

  it('media-picker items should be rendered', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer
        {...props}
        items={[
          {
            mimeType: 'application/vnd.atlassian.mediapicker.folder',
            id: '1',
            name: '',
            size: 0,
            date: 0,
          },
        ]}
        nextCursor="some-next-cursor"
      />,
    );

    const fileIcons = wrapper.find(FileIcon);

    expect(fileIcons).toHaveLength(1);
  });

  it('other items should be rendered', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer
        {...props}
        items={[
          {
            mimeType: 'image/png',
            id: '1',
            name: '',
            size: 0,
            date: 0,
          },
        ]}
        nextCursor="some-next-cursor"
      />,
    );

    const fileIcons = wrapper.find(FileIcon);

    expect(fileIcons).toHaveLength(1);
  });

  it('should handle empty mime type', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer
        {...props}
        items={[
          {
            mimeType: '',
            id: '1',
            name: '',
            size: 0,
            date: 0,
          },
        ]}
        nextCursor="some-next-cursor"
      />,
    );

    const fileIcons = wrapper.find(FileIcon);

    expect(fileIcons).toHaveLength(1);
  });

  it('should not be selected by default', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer
        {...props}
        items={[
          {
            mimeType: '',
            id: '1',
            name: '',
            size: 0,
            date: 0,
          },
        ]}
        nextCursor="some-next-cursor"
      />,
    );

    const fileName = wrapper.find(FileName);

    expect(fileName.prop('isSelected')).toEqual(false);
  });

  for (const data of [
    {
      size: -1,
      expectedSize: '?', // currently renders "-1 B", is it correct?
    },
    {
      size: 0,
      expectedSize: '0 B',
    },
    {
      size: 1,
      expectedSize: '1 B',
    },
    {
      size: Number.MAX_SAFE_INTEGER,
      expectedSize: '8 PB',
    },
    {
      size: Number.MAX_SAFE_INTEGER + 1,
      expectedSize: '8 PB',
    },
  ]) {
    it(`should render proper size for size:${data.size}`, () => {
      const { props } = setup();

      const wrapper = shallow(
        <FolderViewer
          {...props}
          items={[
            {
              mimeType: '',
              id: '1',
              name: '',
              size: data.size,
              date: 0,
            },
          ]}
          nextCursor="some-next-cursor"
        />,
      );

      const fileSize = wrapper.find(FileSize);

      expect(fileSize.prop('children')).toEqual(data.expectedSize);
    });
  }

  for (const data of [
    {
      date: -8640000000000000,
      expectedDate: '20 Apr -271821',
    },
    {
      date: -86400001,
      expectedDate: '30 Dec 1969',
    },
    {
      date: -1,
      expectedDate: '31 Dec 1969',
    },
    {
      date: 0,
      expectedDate: '1 Jan 1970',
    },
    {
      date: 1,
      expectedDate: '1 Jan 1970',
    },
    {
      date: 86400001,
      expectedDate: '2 Jan 1970',
    },
    {
      date: Date.now(),
      expectedDate: datefmt(Date.now(), 'H:MM TT'),
    },
    {
      date: 8640000000000000,
      expectedDate: '13 Sep 275760',
    },
  ]) {
    it(`should render proper date for date:${data.date}`, () => {
      const { props } = setup();

      const wrapper = shallow(
        <FolderViewer
          {...props}
          items={[
            {
              mimeType: '',
              id: '1',
              name: '',
              size: 0,
              date: data.date,
            },
          ]}
          nextCursor="some-next-cursor"
        />,
      );

      const fileDate = wrapper.find(FileCreateDate);

      expect(fileDate.prop('children')).toEqual(data.expectedDate);
    });
  }

  for (const data of [
    {
      date: Number.MIN_SAFE_INTEGER - 1,
    },
    {
      date: Number.MIN_SAFE_INTEGER,
    },
    {
      date: -8640000000000001,
    },
    {
      date: 8640000000000001,
    },
    {
      date: Number.MAX_SAFE_INTEGER,
    },
    {
      date: Number.MAX_SAFE_INTEGER + 1,
    },
  ]) {
    it(`should throw for date:${data.date}`, () => {
      const { props } = setup();

      expect(() =>
        shallow(
          <FolderViewer
            {...props}
            items={[
              {
                mimeType: '',
                id: '1',
                name: '',
                size: 0,
                date: data.date,
              },
            ]}
            nextCursor="some-next-cursor"
          />,
        ),
      ).toThrow();
    });
  }

  it('should handle both directories and files', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer
        {...props}
        items={[
          {
            mimeType: 'application/vnd.atlassian.mediapicker.folder',
            id: '1',
            name: '',
            size: 0,
            date: 0,
          },
          {
            mimeType: 'image/png',
            id: '1',
            name: '',
            size: 0,
            date: 0,
          },
        ]}
        nextCursor="some-next-cursor"
      />,
    );

    const fileIcons = wrapper.find(FileIcon);

    expect(fileIcons).toHaveLength(2);
  });

  it('should handle multiple directories and files', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer
        {...props}
        items={[
          ...(function() {
            const arr: Array<any> = [];
            for (let i = 0; i < 5000; i++) {
              arr.push({
                mimeType: 'image/png',
                id: i,
                name: '',
                size: 0,
                date: 0,
              });
            }
            return arr;
          })(),
          ...(function() {
            const arr: Array<any> = [];
            for (let i = 0; i < 5000; i++) {
              arr.push({
                mimeType: 'image/png',
                id: i,
                name: '',
                size: 0,
                date: 0,
              });
            }
            return arr;
          })(),
        ]}
      />,
    );

    const fileIcons = wrapper.find(FileIcon);

    expect(fileIcons).toHaveLength(10000); // this number is just an abstract upper limit, we need to check what's the maximum we support
  });

  it('should render name as selected if selected', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer
        {...props}
        items={[
          {
            mimeType: 'application/vnd.atlassian.mediapicker.folder',
            id: '1',
            name: '',
            size: 0,
            date: 0,
          },
          {
            mimeType: 'image/png',
            id: '2',
            name: 'image.png',
            size: 0,
            date: 0,
          },
        ]}
        selectedItems={[
          {
            mimeType: 'image/png',
            id: '2',
            name: 'image.png',
            size: 0,
            date: 0,
            serviceName: '',
            accountId: '',
          },
        ]}
        nextCursor="some-next-cursor"
      />,
    );

    const fileName = wrapper
      .find(FileName)
      .filterWhere((w: ShallowWrapper) => w.prop('children') === 'image.png');

    expect(fileName.prop('isSelected')).toEqual(true);
  });

  it('should render render spinner if page initial is loading', () => {
    const { props } = setup();
    const wrapper = shallow(<FolderViewer {...props} isLoading={true} />);

    const spinner = wrapper.find(Spinner);
    expect(spinner).toHaveLength(1);
  });

  it('should not render button if no more items', () => {
    const { props } = setup();
    const wrapper = shallow(<FolderViewer {...props} />);

    const moreButton = wrapper.find(AkButton);
    expect(moreButton).toHaveLength(0);
  });

  it('should call updates on button click', () => {
    const { props } = setup();
    const wrapper = shallow(<FolderViewer {...props} nextCursor="1" />);

    const moreButton = wrapper.find(AkButton);
    moreButton.simulate('click');
    expect(wrapper.instance().props.onLoadMoreClick).toBeCalledWith(
      props.service.name,
      props.service.accountId,
      props.path,
      '1',
    );
  });

  it('should call updates on button click with empty nextCursor', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer
        {...props}
        nextCursor=""
        isLoading={true}
        currentCursor="1"
      />,
      { disableLifecycleMethods: true },
    );

    const moreButton = wrapper.find(AkButton);
    wrapper.setProps({ isLoading: false });
    moreButton.simulate('click');
    expect(wrapper.instance().props.onLoadMoreClick).toBeCalledWith(
      props.service.name,
      props.service.accountId,
      props.path,
      '',
    );
  });

  it('click on folder should expand path', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer
        {...props}
        path={[{ id: '0', name: 'nothing' }]}
        items={[
          {
            mimeType: 'application/vnd.atlassian.mediapicker.folder',
            id: '1',
            name: 'folder',
            size: 0,
            date: 0,
          },
        ]}
      />,
    );

    const fileRow = wrapper.find(FolderViewerRow);
    fileRow.simulate('click');

    expect(wrapper.instance().props.onFolderClick).toBeCalledWith(
      props.service.name,
      props.service.accountId,
      [{ id: '0', name: 'nothing' }, { id: '1', name: 'folder' }],
    );
  });

  it('click on file should pass item', () => {
    const { props } = setup();
    const wrapper = shallow(
      <FolderViewer
        {...props}
        items={[
          {
            mimeType: 'image/png',
            id: '1',
            name: 'image.png',
            size: 0,
            date: 0,
          },
        ]}
      />,
    );

    const fileRow = wrapper.find(FolderViewerRow);
    fileRow.simulate('click');

    expect(wrapper.instance().props.onFileClick).toBeCalledWith(
      props.service.name,
      props.service.accountId,
      { date: 0, id: '1', mimeType: 'image/png', name: 'image.png', size: 0 },
    );
  });
});
