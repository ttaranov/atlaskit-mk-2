import styled from 'styled-components';

export const AppWrapper = styled.div`
  width: 100%;
  height: 100%;

  button {
    color: white !important;
  }
`;

export const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  video {
    flex: 1;
  }
`;

export const Timebar = styled.progress``;

export const TimebarWrapper = styled.div`
  display: flex;
  align-items: center;
  color: white;
`;

export const VolumeWrapper = styled.div`
  background: white;
  margin-right: 10px;
`;

export const TimeWrapper = styled.div`
  padding: 0 20px;
  background-color: white;
`;

export const CurrentTime = styled.div`
  width: 100px;
`;
