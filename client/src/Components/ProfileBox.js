import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Redux/Slices/userSlice';
import { reset } from '../Redux/Slices/boardsSlice';
import { useHistory } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

export default function ProfileBox() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const dispatch = useDispatch();
	const history = useHistory();
	const open = Boolean(anchorEl);
	const user = useSelector((state) => state.user.userInfo);
	const name = user.name;
	const surname = user.surname;
	const email = user.email;
	const color = user.color;

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<React.Fragment>
			<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
				<Tooltip title='Account settings'>
					<IconButton onClick={handleClick} size='small' sx={{ ml: 2 }}>
						<Avatar sx={{ width: 32, height: 32, bgcolor: color, fontSize: '0.875rem', fontWeight: '800' }}>
							{name[0]}
						</Avatar>
					</IconButton>
				</Tooltip>
			</Box>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						padding: '0.5rem 0',
						minWidth: '200px',
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<Box sx={{ px: 2, py: 1 }}>
					<Typography variant='subtitle1' sx={{ fontWeight: '700', color: '#1e293b' }}>
						{name} {surname}
					</Typography>
					<Typography variant='body2' sx={{ color: '#64748b', fontSize: '0.8rem' }}>
						{email}
					</Typography>
				</Box>
				<Divider sx={{ my: 1 }} />
				<MenuItem
					onClick={() => {
						history.push('/profile');
					}}
				>
					<ListItemIcon>
						<AccountCircleIcon fontSize='small' />
					</ListItemIcon>
					Profile
				</MenuItem>
				<MenuItem
					onClick={() => {
						dispatch(reset);
						dispatch(logout());
					}}
				>
					<ListItemIcon>
						<Logout fontSize='small' />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
}
