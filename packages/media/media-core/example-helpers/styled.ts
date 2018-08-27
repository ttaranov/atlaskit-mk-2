import styled from 'styled-components';
import { FileStatus } from '../src';

export const FilesWrapper = styled.div``;

export interface FilesWrapperProps {
  status: FileStatus;
}

const statusColorMap = {
  uploading: 'cornflowerblue',
  processing: 'peachpuff',
  processed: 'darkseagreen',
  error: 'indianred',
};

export const FileWrapper = styled.div`
  padding: 5px;
  margin: 10px;
  display: inline-block;
  width: 315px;
  background-color: ${({ status }: FilesWrapperProps) =>
    statusColorMap[status]};
`;
