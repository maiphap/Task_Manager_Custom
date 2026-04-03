import styled from "styled-components";

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
  background-image: url('https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2400x1600/a651551a5214cb84963366cf9eaacb40/photo-1636207543865-acf3ad382295.jpg');
  background-position: 50%;
  background-size: cover;
`;

export const VideoBackground = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  width: auto;
  height: auto;
  min-width: 100%;
  min-height: 100%;
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: -1;
`;

export const Title = styled.h1`
  cursor: default;
  font-weight: 400;
  font-size: 1.5rem;
  text-align: center;
  width: 100vw;
  margin-bottom: 1rem;
  color: lightblue;
  text-shadow:
    3px 0px 7px rgba(81, 67, 21, 0.8),
    -3px 0px 7px rgba(81, 67, 21, 0.8),
    0px 4px 7px rgba(81, 67, 21, 0.8);
  user-select: none;
`;

export const Wrapper = styled.div`
  margin-top: 3.1rem;
  width: 100%;
  height: calc(100vh - 3.1rem);
  padding: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: auto;
`;

export const Board = styled.div`
  color: white;
  padding: 0.6rem;
  margin: 0 0.8rem 1rem 0.8rem;
  width: 200px;
  height: 120px;
  border-radius: 5px;
  ${(props) =>
    props.isImage
      ? "background-image: url(" + props.link + ");"
      : "background-color: " + props.link + ";"}

  background-position: center center;
  background-size: cover;
  -webkit-box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
  -moz-box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
  box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
  opacity: 88%;
  cursor: pointer;
  will-change: opacity;
  transition: opacity 450ms;
  &:hover {
    opacity: 100%;
    transition: opacity 150ms;
    font-weight: 600;
  }
`;

export const AddBoard = styled(Board)`
  background-color: transparent;
  background-image: linear-gradient(
    to right,
    #0b486b 0%,
    #f56217 51%,
    #0b486b 100%
  );
  font-size: 1.2rem;
  transition: 2s;
  opacity: 65%;
  background-size: 200% auto;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    background-position: right center;
    color: #fff;
    transition: 400ms ease-in;
  }
`;

export const BoardMemberWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin-top: auto;
  gap: 2px;
`;

export const BoardMemberAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.color || '#4f46e5'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  border: 1px solid white;
`;
