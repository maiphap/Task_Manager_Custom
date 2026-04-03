import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getSystemNotification } from '../Services/adminService';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

const BannerContainer = styled.div`
	width: 100%;
	background-color: #f2d600;
	color: #172b4d;
	padding: 0.5rem 1rem;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	font-weight: 600;
	z-index: 1000;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	animation: slideDown 0.3s ease-out;

	@keyframes slideDown {
		from { transform: translateY(-100%); }
		to { transform: translateY(0); }
	}
`;

const Message = styled.span`
	margin-right: 2rem;
`;

const CloseButton = styled(IconButton)`
	position: absolute !important;
	right: 1rem;
	color: #172b4d !important;
	padding: 4px !important;
`;

const SystemBanner = () => {
	const [notification, setNotification] = useState({ message: '', active: false });
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const fetchNotification = async () => {
			const data = await getSystemNotification();
			if (data && data.active) {
				const dismissed = localStorage.getItem('dismissed_notification');
				if (dismissed !== data.message) {
					setNotification(data);
					setIsVisible(true);
				}
			}
		};
		fetchNotification();
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		localStorage.setItem('dismissed_notification', notification.message);
	};

	if (!isVisible || !notification.active || !notification.message) return null;

	return (
		<BannerContainer>
			<Message>{notification.message}</Message>
			<CloseButton onClick={handleClose} size="small">
				<CloseIcon fontSize="small" />
			</CloseButton>
		</BannerContainer>
	);
};

export default SystemBanner;
