import LoadingScreen from "../../LoadingScreen";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBoards, getInvitations, acceptInvite, rejectInvite } from "../../../Services/boardsService";
import Navbar from "../../Navbar";
import {
  Container,
  VideoBackground,
  Wrapper,
  Title,
  Board,
  AddBoard,
  BoardMemberWrapper,
  BoardMemberAvatar,
} from "./Styled";
import CreateBoard from "../../Modals/CreateBoardModal/CreateBoard";
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

const InvitationCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
  width: 250px;
  border-left: 5px solid #4f46e5;
`;

const InvitationTitle = styled.div`
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  transition: opacity 0.2s;
  background: ${props => props.type === 'accept' ? '#4f46e5' : '#e2e8f0'};
  color: ${props => props.type === 'accept' ? 'white' : '#475569'};
  &:hover { opacity: 0.9; }
`;

const Boards = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { pending, boardsData, invitations } = useSelector((state) => state.boards);
  const [openModal, setOpenModal] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [videoError, setVideoError] = useState(false);

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleClick = (e) => {
    const boardId = e.currentTarget.id;
    history.push(`/board/${boardId}`);
  };

  useEffect(() => {
    getBoards(false, dispatch);
    getInvitations(dispatch);
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
          {invitations && invitations.length > 0 && (
            <>
              <Title style={{ width: '100%', textAlign: 'left', marginLeft: '5%', color: 'white' }}>Pending Invitations</Title>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', width: '90%' }}>
                {invitations.map((invite) => (
                  <InvitationCard key={invite._id}>
                    <InvitationTitle>{invite.title}</InvitationTitle>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Mời bạn tham gia bảng này
                    </div>
                    <ButtonGroup>
                      <ActionButton type="accept" onClick={() => acceptInvite(invite._id, dispatch)}>
                        Đồng ý
                      </ActionButton>
                      <ActionButton type="reject" onClick={() => rejectInvite(invite._id, dispatch)}>
                        Từ chối
                      </ActionButton>
                    </ButtonGroup>
                  </InvitationCard>
                ))}
              </div>
            </>
          )}
          <Title style={{ width: '100%', textAlign: 'left', marginLeft: '5%', color: 'white' }}>Your Boards</Title>
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
                    onClick={handleClick}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ fontWeight: 600, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{item.title}</div>
                      <BoardMemberWrapper>
                        {item.members && item.members
                          .filter(member => !member.status || member.status === 'joined')
                          .slice(0, 4)
                          .map((member) => (
                            <Tooltip
                              key={member.user}
                              TransitionComponent={Zoom}
                              title={`${member.name} ${member.surname}`}
                              size="small"
                              placement="top"
                              arrow
                            >
                              <BoardMemberAvatar color={member.color}>
                                {member.name ? member.name[0].toUpperCase() : 'U'}
                              </BoardMemberAvatar>
                            </Tooltip>
                          ))}
                        {item.members && item.members.filter(m => !m.status || m.status === 'joined').length > 4 && (
                          <BoardMemberAvatar color="#64748b" style={{ fontSize: '0.6rem' }}>
                            +{item.members.filter(m => !m.status || m.status === 'joined').length - 4}
                          </BoardMemberAvatar>
                        )}
                      </BoardMemberWrapper>
                    </div>
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
