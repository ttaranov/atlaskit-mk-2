import styled from 'styled-components';

export const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
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
`;

export const VolumeWrapper = styled.div`
  flex: 1;
  margin-right: 10px;
`;

export const TimeWrapper = styled.div`
  width: 700px;
  margin-right: 30px;
`;

export const CurrentTime = styled.div`
  width: 100px;
`;
