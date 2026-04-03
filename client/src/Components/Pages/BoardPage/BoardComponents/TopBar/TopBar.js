import React, { useEffect, useState } from 'react';
import * as style from './styled';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import * as common from '../../CommonStyled';
import { useDispatch, useSelector } from 'react-redux';
import { boardTitleUpdate } from '../../../../../Services/boardsService';
import RightDrawer from '../../../../Drawers/RightDrawer/RightDrawer';
import BasePopover from '../../../../Modals/EditCardModal/ReUsableComponents/BasePopover';
import InviteMembers from '../../../../Modals/EditCardModal/Popovers/InviteMembers/InviteMembers';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

import { boardMemberRemove } from '../../../../../Services/boardService';

const TopBar = () => {
	const board = useSelector((state) => state.board);
	const user = useSelector((state) => state.user.userInfo);
	const { members } = board;
	const [currentTitle, setCurrentTitle] = useState(board.title);
	const [showDrawer, setShowDrawer] = useState(false);
	const [invitePopover, setInvitePopover] = React.useState(null);
	const dispatch = useDispatch();

	const isOwner = members.find(m => 
		(String(m.user) === String(user?._id) || String(m.user) === String(user?.id))
	)?.role === 'owner';

	useEffect(() => {
		if (!board.loading) setCurrentTitle(board.title);
	}, [board.loading, board.title]);

	const handleTitleChange = () => {
		boardTitleUpdate(currentTitle, board.id, dispatch);
	};

	const handleRemoveMember = (memberId) => {
		if (window.confirm('Are you sure you want to remove this member?')) {
			boardMemberRemove(board.id, memberId, dispatch);
		}
	};

	return (
		<style.TopBar>
			<style.LeftWrapper>
				<style.InviteButton onClick={(event) => setInvitePopover(event.currentTarget)}>
					<PersonAddAltIcon />
					<style.TextSpan>Add Member</style.TextSpan>
				</style.InviteButton>
				{invitePopover && (
					<BasePopover
						anchorElement={invitePopover}
						closeCallback={() => {
							setInvitePopover(null);
						}}
						title='Invite Members'
						contents={
							<InviteMembers
								closeCallback={() => {
									setInvitePopover(null);
								}}
							/>
						}
					/>
				)}

				<style.BoardNameInput
					placeholder='Board Name'
					value={currentTitle}
					onChange={(e) => setCurrentTitle(e.target.value)}
					onBlur={handleTitleChange}
				/>
				<style.MemberWrapper>
					{members
						.map((member) => (
							<Tooltip
								key={member.user}
								TransitionComponent={Zoom}
								title={`${member.name} ${member.surname} ${member.status === 'pending' ? '(Invited)' : ''}`}
								size='small'
								placement='top'
								arrow
							>
								<style.MemberAvatar color={member.color} isPending={member.status === 'pending'}>
									{member.name.toString()[0].toUpperCase()}
									{isOwner && String(member.user) !== String(user?._id) && String(member.user) !== String(user?.id) && (
										<style.RemoveIcon 
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveMember(member.user);
											}}
										>
											×
										</style.RemoveIcon>
									)}
								</style.MemberAvatar>
							</Tooltip>
						))}
				</style.MemberWrapper>
			</style.LeftWrapper>

			<style.RightWrapper>
				<common.Button onClick={()=>{setShowDrawer(true)}}>
					<MoreHorizIcon />
					<style.TextSpan>Show menu</style.TextSpan>
				</common.Button>
			</style.RightWrapper>
			<RightDrawer show={showDrawer} closeCallback={()=>{setShowDrawer(false)}} />
		</style.TopBar>
	);
};

export default TopBar;
