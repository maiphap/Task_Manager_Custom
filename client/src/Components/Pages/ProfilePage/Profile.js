import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../Navbar';
import { updateProfile } from '../../../Services/userService';
import { xs } from '../../../BreakPoints';
import { Avatar, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DashboardIcon from '@mui/icons-material/Dashboard';

const Container = styled.div`
	padding-top: 5rem;
	padding-bottom: 3rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: 100vh;
	background-color: #f8fafc;
	font-family: 'Inter', sans-serif;
`;

const ProfileCard = styled.div`
	width: 100%;
	max-width: 800px;
	background: white;
	border-radius: 20px;
	box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	${xs({ maxWidth: '95%' })}
`;

const CoverImage = styled.div`
	height: 160px;
	background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
	position: relative;
`;

const ProfileContent = styled.div`
	padding: 0 3rem 3rem;
	position: relative;
	margin-top: -60px;
	display: flex;
	flex-direction: column;
	align-items: center;
	${xs({ padding: '0 1.5rem 2rem' })}
`;

const AvatarWrapper = styled.div`
	position: relative;
	margin-bottom: 1.5rem;
`;

const LargeAvatar = styled(Avatar)`
	width: 120px !important;
	height: 120px !important;
	border: 5px solid white !important;
	font-size: 3rem !important;
	font-weight: 800 !important;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const InfoSection = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
	margin-top: 2rem;
	${xs({ gridTemplateColumns: '1fr' })}
`;

const InfoBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	
	label {
		font-size: 0.8rem;
		font-weight: 700;
		color: #64748b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.value {
		font-size: 1.1rem;
		font-weight: 600;
		color: #1e293b;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		svg { color: #94a3b8; font-size: 1.2rem; }
	}
`;

const ColorPickerWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 1rem;
`;

const ColorOption = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background-color: ${props => props.color};
	cursor: pointer;
	border: 3px solid ${props => props.active ? '#1e293b' : 'transparent'};
	transition: all 0.2s;
	&:hover { transform: scale(1.1); }
`;

const ActionHeader = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	margin-bottom: 1.5rem;
`;

const Profile = () => {
	const user = useSelector((state) => state.user.userInfo);
	const dispatch = useDispatch();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: user.name,
		surname: user.surname,
		color: user.color
	});

	const colors = ['#4f46e5', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

	const handleSave = async () => {
		const success = await updateProfile(formData, dispatch);
		if (success) setIsEditing(false);
	};

	const handleCancel = () => {
		setFormData({
			name: user.name,
			surname: user.surname,
			color: user.color
		});
		setIsEditing(false);
	};

	return (
		<>
			<Navbar />
			<Container>
				<ProfileCard>
					<CoverImage />
					<ProfileContent>
						<AvatarWrapper>
							<LargeAvatar sx={{ bgcolor: isEditing ? formData.color : user.color }}>
								{formData.name[0]}
							</LargeAvatar>
						</AvatarWrapper>

						<ActionHeader>
							{!isEditing ? (
								<Button 
									variant="outlined" 
									startIcon={<EditIcon />} 
									onClick={() => setIsEditing(true)}
									sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
								>
									Edit Profile
								</Button>
							) : (
								<div style={{ display: 'flex', gap: '0.5rem' }}>
									<Button 
										variant="contained" 
										startIcon={<SaveIcon />} 
										onClick={handleSave}
										sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, bgcolor: '#4f46e5' }}
									>
										Save
									</Button>
									<Button 
										variant="text" 
										startIcon={<CancelIcon />} 
										onClick={handleCancel}
										sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: '#64748b' }}
									>
										Cancel
									</Button>
								</div>
							)}
						</ActionHeader>

						<div style={{ textAlign: 'center', marginBottom: '2rem' }}>
							<h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>
								{user.name} {user.surname}
							</h1>
							<p style={{ margin: '0.5rem 0 0', color: '#64748b', fontWeight: 500 }}>
								@{user.name.toLowerCase()}{user.surname.toLowerCase()}
							</p>
						</div>

						{isEditing ? (
							<div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
									<TextField 
										label="First Name" 
										fullWidth 
										value={formData.name}
										onChange={(e) => setFormData({...formData, name: e.target.value})}
									/>
									<TextField 
										label="Last Name" 
										fullWidth 
										value={formData.surname}
										onChange={(e) => setFormData({...formData, surname: e.target.value})}
									/>
								</div>
								<div>
									<label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>AVATAR COLOR</label>
									<ColorPickerWrapper>
										{colors.map(c => (
											<ColorOption 
												key={c} 
												color={c} 
												active={formData.color === c} 
												onClick={() => setFormData({...formData, color: c})}
											/>
										))}
									</ColorPickerWrapper>
								</div>
							</div>
						) : (
							<InfoSection>
								<InfoBox>
									<label>Email Address</label>
									<div className="value"><MailOutlineIcon /> {user.email}</div>
								</InfoBox>
								<InfoBox>
									<label>Account Role</label>
									<div className="value"><VerifiedUserIcon /> {user.role === 'admin' ? 'Administrator' : 'Standard User'}</div>
								</InfoBox>
								<InfoBox>
									<label>Member Since</label>
									<div className="value">
										<EventAvailableIcon /> 
										{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN', { 
											year: 'numeric', month: 'long', day: 'numeric' 
										}) : 'Recent'}
									</div>
								</InfoBox>
								<InfoBox>
									<label>Total Boards</label>
									<div className="value"><DashboardIcon /> {user.boards?.length || 0} boards joined</div>
								</InfoBox>
							</InfoSection>
						)}
					</ProfileContent>
				</ProfileCard>
			</Container>
		</>
	);
};

export default Profile;
