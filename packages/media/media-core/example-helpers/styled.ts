import styled from 'styled-components';
import { FileStatus } from '../src';

export const FilesWrapper = styled.div``;

export interface FilesWrapperProps {
  status: FileStatus;
}

export const FileWrapper = styled.div`
  padding: 5px;
  margin: 10px;
  display: inline-block;
  width: 315px;
  background-color: ${({ status }: FilesWrapperProps) =>
    status === 'processing' ? '#f4d6db' : '#b3dbd3'};
`;
