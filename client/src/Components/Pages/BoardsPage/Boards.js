import LoadingScreen from "../../LoadingScreen";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBoards } from "../../../Services/boardsService";
import Navbar from "../../Navbar";
import {
  Container,
  VideoBackground,
  Wrapper,
  Title,
  Board,
  AddBoard,
} from "./Styled";
import CreateBoard from "../../Modals/CreateBoardModal/CreateBoard";
import { useHistory } from "react-router";

const Boards = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { pending, boardsData } = useSelector((state) => state.boards);
  const [openModal, setOpenModal] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [videoError, setVideoError] = useState(false);

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleClick = (e) => {
    history.push(`/board/${e.target.id}`);
  };

  useEffect(() => {
    getBoards(false, dispatch);
  }, [dispatch]);

  useEffect(() => {
    document.title = "Boards | Task Manager";
  }, []);

  return (
    <>
      {pending && <LoadingScreen />}
      <Container>
        {!videoError && (
          <VideoBackground
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2400x1600/a651551a5214cb84963366cf9eaacb40/photo-1636207543865-acf3ad382295.jpg"
            onError={() => setVideoError(true)}
          >
            <source src="/background_video.mp4" type="video/mp4" />
            <source src="/background_video.webm" type="video/webm" />
          </VideoBackground>
        )}
        <Navbar searchString={searchString} setSearchString={setSearchString} />
        <Wrapper>
          <Title>Your Boards</Title>
          {!pending &&
            boardsData.length > 0 &&
            boardsData
              .filter((item) =>
                searchString
                  ? item.title
                      .toLowerCase()
                      .includes(searchString.toLowerCase())
                  : true,
              )
              .map((item) => {
                return (
                  <Board
                    key={item._id}
                    link={item.backgroundImageLink}
                    isImage={item.isImage}
                    id={item._id}
                    onClick={(e) => handleClick(e)}
                  >
                    {item.title}
                  </Board>
                );
              })}
          {!pending && (
            <AddBoard onClick={() => setOpenModal(true)}>
              Create new board
            </AddBoard>
          )}
          {openModal && <CreateBoard callback={handleModalClose} />}
        </Wrapper>
      </Container>
    </>
  );
};

export default Boards;
