import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';
import SearchBar from './SearchBar';
import { xs } from '../BreakPoints';
import ProfileBox from './ProfileBox';
import Logo from '../Images/logo.svg';

const Container = styled.div`
	height: 3rem;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(24px);
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 0.5rem 1rem;
	gap: 0.5rem;
	${xs({
		padding: '0.5rem, 0rem',
	})}
`;

const LeftSide = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	gap: 1rem;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	${xs({
		gap: '0.1rem',
		width: 'fit-content',
	})}
`;

const RightSide = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
`;

const LogoContainer = styled.div`
	display: flex;
	align-items: center;
`;

const AppLogo = styled.img`
	width: 100px;
	height: 40px;
	cursor: pointer;
`;

const DropdownContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	${xs({
		display: 'none',
	})}
`;

const NavLink = styled.div`
	color: white;
	font-weight: 500;
	cursor: pointer;
	padding: 0.4rem 0.6rem;
	border-radius: 3px;
	height: 2rem;
	display: flex;
	align-items: center;
	&:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}
`;

const Navbar = (props) => {
	const history = useHistory();
	const user = useSelector((state) => state.user.userInfo);

	return (
		<Container>
			<LeftSide>
				<LogoContainer>
					<AppLogo
						onClick={() => {
							history.push('/boards');
						}}
						src={Logo}
					/>
				</LogoContainer>
				<DropdownContainer>
					<DropdownMenu title='Your Boards' />
				</DropdownContainer>
				{user && user.role === 'admin' && <NavLink onClick={() => history.push('/admin')}>Admin</NavLink>}
			</LeftSide>
			<RightSide>
				<SearchBar searchString={props.searchString} setSearchString={props.setSearchString} />
				<ProfileBox />
			</RightSide>
		</Container>
	);
};

export default Navbar;
